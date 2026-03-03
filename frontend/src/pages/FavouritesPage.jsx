import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFavoritesApi, toggleFavoriteApi } from '../services/api';
import { Heart, Trash2, MapPin, Building2, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FavouritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      toast.error("Please login to view favorites");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getUserFavoritesApi();
      if (res.data.success) {
        setFavorites(res.data.favorites);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (type, doctorId, hospitalId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) return toast.error("Please login to perform this action!");

      const response = await toggleFavoriteApi({
        userId: storedUser.id || storedUser._id,
        doctorId: doctorId,
        hospitalId: hospitalId,
        type: type
      });

      if (response.data.success) {
        toast.success("Removed from favorites");
        fetchFavorites();
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Failed to remove");
    }
  };

  const doctorFavorites = favorites.filter(fav => fav.type === 'doctor');
  const hospitalFavorites = favorites.filter(fav => fav.type === 'hospital');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-1 lg:px-12 pt-1 pb-20">

      <div className="mb-8 text-left">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Personal Collection</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center border border-slate-50 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={30} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Favorites Yet</h3>
          <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto leading-relaxed">
            You haven't saved any doctors or hospitals to your favorites list.
          </p>
        </div>
      ) : (
        <div className="space-y-12">

          {/* --- DOCTOR FAVORITES SECTION (UI Unchanged) --- */}
          {doctorFavorites.length > 0 && (
            <div>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Favorite Doctors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctorFavorites.map((fav) => (
                  <div key={fav._id} className="bg-white rounded-[35px] p-5 shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative mb-4">
                      <div className="w-full h-48 rounded-[30px] overflow-hidden bg-blue-50">
                        <img
                          src={`http://localhost:3000/uploads/${fav.doctorDetails?.doctorImage}`}
                          className="w-full h-full object-cover"
                          alt={fav.doctorDetails?.doctorName}
                          onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite('doctor', fav.doctorId, null)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-100 text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-blue-500 font-bold text-[9px] uppercase tracking-[0.15em]">{fav.doctorDetails?.specialization || 'Doctor'}</p>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors truncate">
                        {fav.doctorDetails?.doctorName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SEPARATOR LINE --- */}
          {doctorFavorites.length > 0 && hospitalFavorites.length > 0 && (
            <div className="border-t border-slate-200"></div>
          )}

          {hospitalFavorites.length > 0 && (
            <div>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Favorite Hospitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hospitalFavorites.map((fav) => (
                  <div key={fav._id} className="bg-white rounded-[35px] shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    
                    <div className="relative h-40">
                      <img
                        src={`http://localhost:3000/uploads/${fav.hospitalDetails?.coverImage}`}
                        className="w-full h-full object-cover"
                        alt={fav.hospitalDetails?.hospitalName}
                        onError={(e) => e.target.src = "https://via.placeholder.com/600x200"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/70 backdrop-blur-sm text-slate-800 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                          {fav.hospitalDetails?.hospitalType || 'Hospital'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                          <button 
                              onClick={() => handleRemoveFavorite('hospital', null, fav.hospitalId)}
                              className="p-2 rounded-full bg-white/70 backdrop-blur-sm text-red-500 hover:bg-white transition-all"
                          >
                              <Trash2 size={16} />
                          </button>
                      </div>
                      

                      <div className="absolute -bottom-6 left-5 w-16 h-16 rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl">
                          <img
                            src={`http://localhost:3000/uploads/${fav.hospitalDetails?.hospitalLogo}`}
                            className="w-full h-full object-contain p-1"
                            alt={fav.hospitalDetails?.hospitalName}
                            onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                          />
                      </div>
                    </div>

                    <div className="p-5 pt-8 text-left">
                        
                        <h4 className="font-black text-slate-800 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                            {fav.hospitalDetails?.hospitalName || "Loading..."}
                        </h4>
                        
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700 truncate">
                                {fav.hospitalDetails?.city 
                                  ? `${fav.hospitalDetails.city}, ${fav.hospitalDetails.province}`
                                  : "Location loading..."}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700">
                                {fav.hospitalDetails?.phone || "No phone listed"}
                            </span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;