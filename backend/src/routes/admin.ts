import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Middleware to verify admin role
const adminMiddleware = async (req: AuthRequest, res: any, next: any) => {
  try {
    // For now, just verify the user exists and is authenticated
    // In production, verify admin role
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return sendError(res, 'UNAUTHORIZED', 'User not found', 403);
    }

    // TODO: In production, uncomment the role check below
    // if (user.role !== 'admin') {
    //   return sendError(res, 'UNAUTHORIZED', 'Admin access required', 403);
    // }

    return next();
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
};

// Get Admin Statistics
router.get('/stats', authMiddleware, adminMiddleware, async (_req: AuthRequest, res) => {
  try {
    // Get total users count
    const { count: totalUsersCount } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true });

    // Get total providers count
    const { count: totalProvidersCount } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'provider');

    // Get total bookings count
    const { count: totalBookingsCount } = await supabaseAdmin
      .from('bookings')
      .select('id', { count: 'exact', head: true });

    // Get completed bookings count
    const { count: completedBookingsCount } = await supabaseAdmin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get total jobs count
    const { count: totalJobsCount } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact', head: true });

    // Get active jobs count
    const { count: activeJobsCount } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get users by role
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('role');

    const regularUsers = (users || []).filter((u: any) => u.role === 'user').length;
    const providers = (users || []).filter((u: any) => u.role === 'provider').length;

    // Get bookings by status
    const { data: bookings } = await supabaseAdmin
      .from('bookings')
      .select('status');

    const bookingsByStatus = [
      { name: 'Completed', value: completedBookingsCount || 0 },
      { 
        name: 'Active', 
        value: (bookings || []).filter((b: any) => b.status === 'active').length 
      },
      { 
        name: 'Cancelled', 
        value: (bookings || []).filter((b: any) => b.status === 'cancelled').length 
      },
    ];

    // Get jobs by category
    const { data: jobsList } = await supabaseAdmin
      .from('jobs')
      .select('category');

    const categories: { [key: string]: number } = {};
    (jobsList || []).forEach((job: any) => {
      categories[job.category] = (categories[job.category] || 0) + 1;
    });

    const jobsByCategory = Object.entries(categories).map(([name, value]) => ({
      name,
      value: value as number,
    }));

    const stats = {
      totalUsers: totalUsersCount || 0,
      totalProviders: totalProvidersCount || 0,
      totalBookings: totalBookingsCount || 0,
      totalJobs: totalJobsCount || 0,
      activeJobs: activeJobsCount || 0,
      completedBookings: completedBookingsCount || 0,
      usersByRole: [
        { name: 'Regular Users', value: regularUsers },
        { name: 'Providers', value: providers },
      ],
      bookingsByStatus,
      jobsByCategory,
    };

    return sendSuccess(res, stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch statistics', 500);
  }
});

// Get All Users
router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { search = '', limit = '50', offset = '0' } = req.query;

    let query = supabaseAdmin
      .from('users')
      .select('id, email, full_name, phone_number, role, created_at, updated_at', { count: 'exact' });

    if (search && search !== '') {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    return sendSuccess(res, { users: users || [], count: count || 0, limit, offset });
  } catch (error) {
    console.error('Get users error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch users', 500);
  }
});

// Get All Providers
router.get('/providers', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { search = '', limit = '50', offset = '0' } = req.query;

    let query = supabaseAdmin
      .from('users')
      .select('id, email, full_name, phone_number, created_at', { count: 'exact' })
      .eq('role', 'provider');

    if (search && search !== '') {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: providers, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // For each provider, fetch their specialization and rating from jobs/bookings
    const enrichedProviders = await Promise.all(
      (providers || []).map(async (provider: any) => {
        // Get jobs count
        const { count: jobsCount } = await supabaseAdmin
          .from('jobs')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', provider.id);

        // Get average rating from bookings if they exist
        const { data: bookings } = await supabaseAdmin
          .from('bookings')
          .select('rating')
          .eq('provider_id', provider.id)
          .not('rating', 'is', null);

        const avgRating = bookings && bookings.length > 0
          ? (bookings.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) / bookings.length).toFixed(1)
          : 0;

        return {
          id: provider.id,
          email: provider.email,
          full_name: provider.full_name,
          phone_number: provider.phone_number,
          specialization: 'General Services',
          location: 'Not specified',
          rating: avgRating,
          total_jobs: jobsCount || 0,
          verified: true,
          created_at: provider.created_at,
        };
      })
    );

    return sendSuccess(res, { providers: enrichedProviders, count: count || 0, limit, offset });
  } catch (error) {
    console.error('Get providers error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch providers', 500);
  }
});

// Get All Bookings
router.get('/bookings', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        id,
        service_name,
        scheduled_date,
        price,
        status,
        created_at,
        users:user_id(id, full_name),
        providers:provider_id(id, user_id, users:user_id(id, full_name))
      `, { count: 'exact' });

    if (status && status !== '') {
      query = query.eq('status', status);
    }

    const { data: bookings, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // Format bookings response
    const formattedBookings = (bookings || []).map((booking: any) => ({
      id: booking.id,
      user_name: booking.users?.full_name || 'Unknown',
      provider_name: booking.providers?.users?.full_name || 'Unknown',
      service: booking.service_name,
      location: 'Not specified',
      booking_date: booking.scheduled_date,
      price: booking.price,
      status: booking.status,
    }));

    return sendSuccess(res, { bookings: formattedBookings, count: count || 0, limit, offset });
  } catch (error) {
    console.error('Get bookings error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch bookings', 500);
  }
});

// Get All Jobs
router.get('/jobs', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    let query = supabaseAdmin
      .from('jobs')
      .select(`
        id,
        title,
        category,
        location,
        budget,
        status,
        created_at,
        users:user_id(id, full_name)
      `, { count: 'exact' });

    if (status && status !== '') {
      query = query.eq('status', status);
    }

    const { data: jobs, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // Format jobs response and count offers for each
    const formattedJobs = await Promise.all(
      (jobs || []).map(async (job: any) => {
        const { count: offersCount } = await supabaseAdmin
          .from('offers')
          .select('id', { count: 'exact', head: true })
          .eq('job_id', job.id);

        return {
          id: job.id,
          title: job.title,
          category: job.category,
          posted_by: job.users?.full_name || 'Unknown',
          location: job.location,
          budget: job.budget,
          offers_count: offersCount || 0,
          status: job.status,
          posted_date: job.created_at,
        };
      })
    );

    return sendSuccess(res, { jobs: formattedJobs, count: count || 0, limit, offset });
  } catch (error) {
    console.error('Get jobs error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch jobs', 500);
  }
});

export default router;
