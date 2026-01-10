import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Get User Bookings
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        id,
        service_name,
        service_category,
        scheduled_date,
        scheduled_time,
        price,
        status,
        payment_status,
        created_at,
        providers:provider_id(
          id,
          user_id,
          users:user_id(
            id,
            name,
            profile_photo_url
          )
        )
      `)
      .eq('user_id', req.userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return sendError(res, 'DATABASE_ERROR', error.message, 500);
    }

    return sendSuccess(res, {
      bookings,
      total: bookings?.length || 0,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Get Single Booking
router.get('/:bookingId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { bookingId } = req.params;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', req.userId)
      .single();

    if (error || !booking) {
      return sendError(res, 'NOT_FOUND', 'Booking not found', 404);
    }

    return sendSuccess(res, booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

// Cancel Booking
router.put('/:bookingId/cancel', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { bookingId } = req.params;

    // Check if booking belongs to user
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', req.userId)
      .single();

    if (!booking) {
      return sendError(res, 'NOT_FOUND', 'Booking not found', 404);
    }

    if (booking.status !== 'ongoing') {
      return sendError(res, 'INVALID_STATUS', 'Only ongoing bookings can be cancelled', 400);
    }

    // Update booking status
    const { data: updatedBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date(),
      })
      .eq('id', bookingId)
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
          type: 'booking_cancelled',
          title: 'Booking cancelled',
          description: `Cancelled booking for ${booking.service_name}`,
          related_entity_id: bookingId,
        },
      ]);

    return sendSuccess(res, updatedBooking, 'Booking cancelled successfully');
  } catch (error) {
    console.error('Cancel booking error:', error);
    return sendError(res, 'SERVER_ERROR', 'Internal server error', 500);
  }
});

export default router;
