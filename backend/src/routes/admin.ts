import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Middleware: Check if user is admin
async function isAdmin(req: AuthRequest, res: any, next: any) {
  try {
    if (!req.userId) {
      return sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (error || !user || user.role !== 'admin') {
      return sendError(res, 'FORBIDDEN', 'Admin access required', 403);
    }

    next();
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
}

// ============ ADMIN VERIFICATION ============

// Get admin status
router.get('/verify', authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('id', req.userId)
      .single();

    if (error) {
      return sendError(res, 'USER_NOT_FOUND', 'User not found', 404);
    }

    sendSuccess(res, {
      isAdmin: user.role === 'admin',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// ============ USER MANAGEMENT ============

// Get all users with pagination and filters
router.get('/users', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 20);

    let query = supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, phone_number, specialization, is_suspended, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query.range(offset, offset + (Number(limit) || 20) - 1);

    if (error) {
      return sendError(res, 'QUERY_ERROR', error.message, 500);
    }

    sendSuccess(res, {
      users,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total: count || 0,
        pages: Math.ceil((count || 0) / (Number(limit) || 20)),
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Get user details
router.get('/users/:userId', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { userId } = req.params;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return sendError(res, 'USER_NOT_FOUND', 'User not found', 404);
    }

    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Suspend user
router.put('/users/:userId/suspend', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return sendError(res, 'VALIDATION_ERROR', 'Suspension reason is required', 400);
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_suspended: true,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        suspended_by: req.userId,
      })
      .eq('id', userId);

    if (error) {
      return sendError(res, 'UPDATE_ERROR', error.message, 500);
    }

    // Log admin action
    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.userId,
      action: 'suspend_user',
      target_type: 'user',
      target_id: userId,
      changes: { reason },
    });

    sendSuccess(res, { message: 'User suspended successfully' });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Unsuspend user
router.put('/users/:userId/unsuspend', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { userId } = req.params;

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_suspended: false,
        suspension_reason: null,
        suspended_at: null,
        suspended_by: null,
      })
      .eq('id', userId);

    if (error) {
      return sendError(res, 'UPDATE_ERROR', error.message, 500);
    }

    // Log admin action
    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.userId,
      action: 'unsuspend_user',
      target_type: 'user',
      target_id: userId,
    });

    sendSuccess(res, { message: 'User unsuspended successfully' });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// ============ PROVIDER MANAGEMENT ============

// Get all providers
router.get('/providers', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 20);

    let query = supabaseAdmin
      .from('users')
      .select('id, email, full_name, phone_number, specialization, created_at', { count: 'exact' })
      .eq('role', 'provider')
      .order('created_at', { ascending: false });

    if (status === 'verified') {
      query = query.eq('is_verified', true);
    } else if (status === 'pending') {
      query = query.eq('is_verified', false);
    }

    const { data: providers, error, count } = await query.range(offset, offset + (Number(limit) || 20) - 1);

    if (error) {
      return sendError(res, 'QUERY_ERROR', error.message, 500);
    }

    sendSuccess(res, {
      providers,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total: count || 0,
        pages: Math.ceil((count || 0) / (Number(limit) || 20)),
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Get pending provider applications
router.get('/providers/pending', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { data: pending, error } = await supabaseAdmin
      .from('provider_verification_queue')
      .select(
        `
        id,
        provider_id,
        status,
        documents_submitted,
        submission_date,
        users(id, email, full_name, phone_number, specialization)
      `
      )
      .eq('status', 'pending')
      .order('submission_date', { ascending: true });

    if (error) {
      return sendError(res, 'QUERY_ERROR', error.message, 500);
    }

    sendSuccess(res, pending);
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Approve provider
router.put('/providers/:providerId/approve', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { providerId } = req.params;

    // Update provider status
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ is_verified: true })
      .eq('id', providerId);

    if (updateError) {
      return sendError(res, 'UPDATE_ERROR', updateError.message, 500);
    }

    // Update verification queue
    const { error: queueError } = await supabaseAdmin
      .from('provider_verification_queue')
      .update({
        status: 'approved',
        reviewed_by: req.userId,
        review_date: new Date().toISOString(),
      })
      .eq('provider_id', providerId);

    if (queueError) {
      return sendError(res, 'UPDATE_ERROR', queueError.message, 500);
    }

    // Log admin action
    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.userId,
      action: 'approve_provider',
      target_type: 'provider',
      target_id: providerId,
    });

    sendSuccess(res, { message: 'Provider approved successfully' });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Reject provider
router.put('/providers/:providerId/reject', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { providerId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return sendError(res, 'VALIDATION_ERROR', 'Rejection reason is required', 400);
    }

    // Update verification queue
    const { error } = await supabaseAdmin
      .from('provider_verification_queue')
      .update({
        status: 'rejected',
        reviewed_by: req.userId,
        review_date: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq('provider_id', providerId);

    if (error) {
      return sendError(res, 'UPDATE_ERROR', error.message, 500);
    }

    // Log admin action
    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.userId,
      action: 'reject_provider',
      target_type: 'provider',
      target_id: providerId,
      changes: { reason },
    });

    sendSuccess(res, { message: 'Provider rejected successfully' });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// ============ JOBS & BOOKINGS OVERVIEW ============

// Get all jobs with status
router.get('/jobs', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 20);

    let query = supabaseAdmin
      .from('jobs')
      .select('id, title, category, budget, status, posted_by, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: jobs, error, count } = await query.range(offset, offset + (Number(limit) || 20) - 1);

    if (error) {
      return sendError(res, 'QUERY_ERROR', error.message, 500);
    }

    sendSuccess(res, {
      jobs,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total: count || 0,
        pages: Math.ceil((count || 0) / (Number(limit) || 20)),
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Get all bookings with status
router.get('/bookings', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 20);

    let query = supabaseAdmin
      .from('bookings')
      .select('id, service_type, customer_id, provider_id, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error, count } = await query.range(offset, offset + (Number(limit) || 20) - 1);

    if (error) {
      return sendError(res, 'QUERY_ERROR', error.message, 500);
    }

    sendSuccess(res, {
      bookings,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total: count || 0,
        pages: Math.ceil((count || 0) / (Number(limit) || 20)),
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// ============ ANALYTICS ============

// Get platform statistics
router.get('/stats', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    // Total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact' });

    // Total providers
    const { count: totalProviders } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'provider');

    // Active providers (verified)
    const { count: activeProviders } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'provider')
      .eq('is_verified', true);

    // Total jobs posted
    const { count: totalJobs } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact' });

    // Completed jobs
    const { count: completedJobs } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact' })
      .eq('status', 'completed');

    // Total bookings
    const { count: totalBookings } = await supabaseAdmin
      .from('bookings')
      .select('id', { count: 'exact' });

    // Pending provider applications
    const { count: pendingProviders } = await supabaseAdmin
      .from('provider_verification_queue')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');

    // Open reports
    const { count: openReports } = await supabaseAdmin
      .from('admin_reports')
      .select('id', { count: 'exact' })
      .eq('status', 'open');

    const completionRate = totalJobs ? ((completedJobs || 0) / (totalJobs || 1) * 100).toFixed(2) : '0';

    sendSuccess(res, {
      users: {
        total: totalUsers || 0,
        providers: totalProviders || 0,
        activeProviders: activeProviders || 0,
      },
      jobs: {
        total: totalJobs || 0,
        completed: completedJobs || 0,
        completionRate: parseFloat(completionRate as string),
      },
      bookings: {
        total: totalBookings || 0,
      },
      admin: {
        pendingProviderApplications: pendingProviders || 0,
        openReports: openReports || 0,
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// ============ REPORTS & DISPUTES ============

// Get all reports
router.get('/reports', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { status = 'open', page = 1, limit = 20 } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 20);

    const { data: reports, error, count } = await supabaseAdmin
      .from('admin_reports')
      .select(
        `
        id,
        reporter_id,
        reported_user_id,
        report_type,
        description,
        status,
        created_at,
        users(id, email, full_name)
      `,
        { count: 'exact' }
      )
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + (Number(limit) || 20) - 1);

    if (error) {
      return sendError(res, 'QUERY_ERROR', error.message, 500);
    }

    sendSuccess(res, {
      reports,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total: count || 0,
        pages: Math.ceil((count || 0) / (Number(limit) || 20)),
      },
    });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Resolve report
router.put('/reports/:reportId/resolve', authMiddleware, isAdmin, async (req: AuthRequest, res: any) => {
  try {
    const { reportId } = req.params;
    const { resolution, action } = req.body; // action: 'suspend_user', 'dismiss', 'note_issue'

    const { error } = await supabaseAdmin
      .from('admin_reports')
      .update({
        status: 'resolved',
        resolution_notes: resolution,
        resolved_by: req.userId,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (error) {
      return sendError(res, 'UPDATE_ERROR', error.message, 500);
    }

    // If suspending user, do that too
    if (action === 'suspend_user') {
      const { data: report } = await supabaseAdmin
        .from('admin_reports')
        .select('reported_user_id')
        .eq('id', reportId)
        .single();

      if (report) {
        await supabaseAdmin
          .from('users')
          .update({
            is_suspended: true,
            suspension_reason: `Suspended due to report: ${resolution}`,
            suspended_at: new Date().toISOString(),
            suspended_by: req.userId,
          })
          .eq('id', report.reported_user_id);
      }
    }

    // Log admin action
    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.userId,
      action: 'resolve_report',
      target_type: 'report',
      target_id: reportId,
      changes: { resolution, action },
    });

    sendSuccess(res, { message: 'Report resolved successfully' });
  } catch (error: any) {
    sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

export default router;
