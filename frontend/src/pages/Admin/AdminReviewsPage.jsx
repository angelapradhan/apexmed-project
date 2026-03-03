import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquareText, CalendarDays, User, Hash, Mail } from 'lucide-react'; 
import { toast } from 'react-hot-toast';
import { getAllReviewsApi, deleteReviewApi } from '../../services/api'; 

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await getAllReviewsApi();
      
      if (res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReviewApi(reviewId);
      toast.success("Review deleted successfully!");
      fetchAllReviews(); 
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 lg:px-12 pt-2 pb-20 bg-slate-50/50 min-h-screen">
      <h1 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Admin: All Reviews & Feedback</h1>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-[30px] p-20 text-center border border-slate-100 shadow-sm">
          <MessageSquareText size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Reviews Yet</h3>
          <p className="text-slate-500 text-sm mt-2">There are no reviews posted yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[30px] p-4 border border-slate-100 shadow-sm">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-2xl transition-all">
              
              <div className="flex items-center gap-4 flex-1">

                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                    <User className="text-slate-400" size={24} />
                </div>
                
                <div className='flex-1'>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-slate-800 text-base">
                      {review.userName || 'Anonymous'}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail size={14} />
                        {review.userEmail || 'No Email'}
                    </div>
                  </div>

                  {/* DISPLAY DOCTOR ID */}
                  <div className="flex items-center gap-2 mt-2">
                    <Hash size={14} className="text-slate-400" />
                    <span className="text-slate-600 text-xs font-semibold">
                      Target Doctor ID: {review.doctorId}
                    </span>
                  </div>
                  
                  {/* COMMENT */}
                  <p className="text-slate-700 text-sm mt-2 leading-relaxed bg-slate-100 p-3 rounded-xl border border-slate-50">
                    "{review.comment}"
                  </p>
                  
                  {/* DATE */}
                  <div className="flex items-center gap-2 mt-3 text-slate-400 text-[10px] font-medium">
                    <CalendarDays size={12} />
                    Posted on {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 md:ml-4">
                <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all active:scale-95"
                    title="Delete Review"
                >
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;