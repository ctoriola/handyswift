import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { supabaseAdmin } from '../config/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone_number, role = 'user', specialization } = req.body;

    // Validation
    if (!email || !password || !full_name) {
      return sendError(res, 'VALIDATION_ERROR', 'Missing required fields', 400);
    }

    // Generate username from email
    const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return sendError(res, 'USER_EXISTS', 'Email or username already in use', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          username,
          email,
          password_hash: passwordHash,
          full_name,
          phone: phone_number,
          role,
          membership_type: 'Free',
          verification_status: 'unverified',
        },
      ])
      .select()
      .single();

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // If provider, create provider profile with specialization
    if (role === 'provider') {
      const specs = specialization ? (Array.isArray(specialization) ? specialization : [specialization]) : [];
      await supabaseAdmin
        .from('providers')
        .insert([
          {
            user_id: newUser.id,
            is_available: true,
            specialization: specs,
          },
        ]);
    }

    // Create subscription record
    await supabaseAdmin
      .from('subscriptions')
      .insert([
        {
          user_id: newUser.id,
          status: 'active',
          plan_type: 'free',
        },
      ]);

    return sendSuccess(
      res,
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'VALIDATION_ERROR', 'Email and password required', 400);
    }

    // Get user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // If provider, fetch specialization
    let specialization: string[] | undefined = undefined;
    if (user.role === 'provider') {
      const { data: providerData } = await supabaseAdmin
        .from('providers')
        .select('specialization')
        .eq('user_id', user.id)
        .single();
      
      specialization = providerData?.specialization;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data and token
    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          specialization,
        },
        token,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get Current User Profile
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return sendError(res, 'NOT_FOUND', 'User not found', 404);
    }

    return sendSuccess(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      profilePhoto: user.profile_photo_url,
      membershipType: user.membership_type,
      role: user.role,
      verificationStatus: user.verification_status,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, phone, bio, location, profilePhoto, specialization } = req.body;

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        name,
        phone,
        bio,
        location,
        profile_photo_url: profilePhoto,
        updated_at: new Date(),
      })
      .eq('id', req.userId)
      .select()
      .single();

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // If specialization is provided, update provider profile
    if (specialization) {
      const specs = Array.isArray(specialization) ? specialization : [specialization];
      await supabaseAdmin
        .from('providers')
        .update({
          specialization: specs,
          updated_at: new Date(),
        })
        .eq('user_id', req.userId);
    }

    return sendSuccess(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Change Password
router.post('/change-password', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'VALIDATION_ERROR', 'Missing required fields', 400);
    }

    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', req.userId)
      .single();

    if (!user) {
      return sendError(res, 'NOT_FOUND', 'User not found', 404);
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!passwordMatch) {
      return sendError(res, 'INVALID_PASSWORD', 'Current password is incorrect', 401);
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', req.userId);

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get User Statistics
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Get total bookings
    const { count: totalBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    // Get completed bookings
    const { count: completedBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('status', 'completed');

    // Get active jobs
    const { count: activeJobs } = await supabaseAdmin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('status', 'active');

    // Get average rating
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('author_id', req.userId);

    const averageRating = reviews && reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return sendSuccess(res, {
      totalBookings: totalBookings || 0,
      completedBookings: completedBookings || 0,
      activeJobs: activeJobs || 0,
      averageRating: parseFloat(averageRating as string),
      totalReviews: reviews?.length || 0,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

export default router;
