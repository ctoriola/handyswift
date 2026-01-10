import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Post a Job
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, category, location, budget, budget_type, timeline, expiresAt } = req.body;

    if (!title || !category || !location || !budget || !timeline) {
      return sendError(res, 'VALIDATION_ERROR', 'Missing required fields: title, category, location, budget, timeline', 400);
    }

    const { data: newJob, error } = await supabaseAdmin
      .from('jobs')
      .insert([
        {
          user_id: req.userId,
          title,
          description,
          category,
          location,
          budget,
          budget_type: budget_type || 'fixed',
          timeline: timeline,
          expires_at: expiresAt,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // Create activity log
    await supabaseAdmin
      .from('activity_logs')
      .insert([
        {
          user_id: req.userId,
          type: 'job_posted',
          title: 'Job posted',
          description: `Posted job: ${title}`,
          related_entity_id: newJob.id,
        },
      ]);

    return sendSuccess(res, newJob, 'Job posted successfully', 201);
  } catch (error) {
    console.error('Post job error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get User's Jobs
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('user_id', req.userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: jobs, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // Get offers count for each job
    const jobsWithOffers = await Promise.all(
      (jobs || []).map(async (job: any) => {
        const { count: offersCount } = await supabaseAdmin
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id);

        return { ...job, offersCount: offersCount || 0 };
      })
    );

    return sendSuccess(res, {
      jobs: jobsWithOffers,
      total: count || 0,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get Available Jobs for Provider (filtered by provider's specialization)
router.get('/available/for-provider', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Get provider's specialization
    const { data: provider, error: providerError } = await supabaseAdmin
      .from('providers')
      .select('specialization')
      .eq('user_id', req.userId)
      .single();

    if (providerError || !provider) {
      return sendError(res, 'PROVIDER_NOT_FOUND', 'Provider profile not found', 404);
    }

    const specialization = provider.specialization || [];

    // Get jobs in provider's specialization categories that are still open
    const { data: jobs, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .in('category', specialization.length > 0 ? specialization : [''])
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    // Get offers count for each job
    const jobsWithOffers = await Promise.all(
      (jobs || []).map(async (job: any) => {
        const { count: offersCount } = await supabaseAdmin
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id);

        return { ...job, offersCount: offersCount || 0 };
      })
    );

    return sendSuccess(res, {
      jobs: jobsWithOffers,
      total: jobsWithOffers.length,
    });
  } catch (error) {
    console.error('Get available jobs error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get Single Job
router.get('/:jobId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;

    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', req.userId)
      .single();

    if (error || !job) {
      return sendError(res, 'NOT_FOUND', 'Job not found', 404);
    }

    return sendSuccess(res, job);
  } catch (error) {
    console.error('Get job error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get Job Offers
router.get('/:jobId/offers', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to user
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .eq('user_id', req.userId)
      .single();

    if (!job) {
      return sendError(res, 'NOT_FOUND', 'Job not found', 404);
    }

    const { data: offers, error } = await supabaseAdmin
      .from('offers')
      .select(`
        id,
        proposed_price,
        proposed_timeline,
        message,
        status,
        created_at,
        providers:provider_id(
          id,
          average_rating,
          total_reviews,
          users:user_id(
            id,
            name,
            profile_photo_url
          )
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    return sendSuccess(res, { offers });
  } catch (error) {
    console.error('Get offers error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Accept Job Offer
router.put('/:jobId/offers/:offerId/accept', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { jobId, offerId } = req.params;

    // Verify job belongs to user
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', req.userId)
      .single();

    if (!job) {
      return sendError(res, 'NOT_FOUND', 'Job not found', 404);
    }

    // Get offer
    const { data: offer } = await supabaseAdmin
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .eq('job_id', jobId)
      .single();

    if (!offer) {
      return sendError(res, 'NOT_FOUND', 'Offer not found', 404);
    }

    // Update offer status
    await supabaseAdmin
      .from('offers')
      .update({ status: 'accepted' })
      .eq('id', offerId);

    // Reject other offers
    await supabaseAdmin
      .from('offers')
      .update({ status: 'rejected' })
      .eq('job_id', jobId)
      .neq('id', offerId);

    // Close job
    await supabaseAdmin
      .from('jobs')
      .update({ status: 'closed', closed_at: new Date() })
      .eq('id', jobId);

    // Create booking
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          user_id: req.userId,
          provider_id: offer.provider_id,
          service_name: job.title,
          service_category: job.category,
          price: offer.proposed_price,
          status: 'ongoing',
        },
      ])
      .select()
      .single();

    return sendSuccess(res, { offer, booking }, 'Offer accepted and booking created');
  } catch (error) {
    console.error('Accept offer error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Reject Job Offer
router.put('/:jobId/offers/:offerId/reject', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { jobId, offerId } = req.params;

    // Verify job belongs to user
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .eq('user_id', req.userId)
      .single();

    if (!job) {
      return sendError(res, 'NOT_FOUND', 'Job not found', 404);
    }

    const { data: updatedOffer, error } = await supabaseAdmin
      .from('offers')
      .update({ status: 'rejected' })
      .eq('id', offerId)
      .select()
      .single();

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    return sendSuccess(res, updatedOffer, 'Offer rejected successfully');
  } catch (error) {
    console.error('Reject offer error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Close Job
router.put('/:jobId/close', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;

    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', req.userId)
      .single();

    if (!job) {
      return sendError(res, 'NOT_FOUND', 'Job not found', 404);
    }

    if (job.status !== 'active') {
      return sendError(res, 'INVALID_STATUS', 'Only active jobs can be closed', 400);
    }

    // Reject all pending offers
    await supabaseAdmin
      .from('offers')
      .update({ status: 'rejected' })
      .eq('job_id', jobId)
      .eq('status', 'pending');

    // Close job
    const { data: closedJob, error } = await supabaseAdmin
      .from('jobs')
      .update({ status: 'closed', closed_at: new Date() })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    return sendSuccess(res, closedJob, 'Job closed successfully');
  } catch (error) {
    console.error('Close job error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

export default router;
