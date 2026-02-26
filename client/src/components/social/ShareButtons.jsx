import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ShareButtons({ song }) {
  const url  = `${window.location.origin}/song/${song._id}`;
  const text = `Listening to ${song.title} by ${song.artist} 🎵`;

  const shareFb = (e) => {
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTw = (e) => {
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareIg = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${text} ${url}`);
    toast.success('Link copied — paste on Instagram!');
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <button onClick={shareFb} className="text-[#b3b3b3] hover:text-[#1877F2] transition-colors"><FaFacebook size={13} /></button>
      <button onClick={shareTw} className="text-[#b3b3b3] hover:text-[#1DA1F2] transition-colors"><FaTwitter  size={13} /></button>
      <button onClick={shareIg} className="text-[#b3b3b3] hover:text-[#E1306C] transition-colors"><FaInstagram size={13} /></button>
    </div>
  );
}