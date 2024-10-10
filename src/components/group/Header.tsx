import { useRef, useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { updateImage } from '@/services/userService';

interface HeaderProps {
  selectedGroup: string | null;
}

const Header: React.FC<HeaderProps> = ({ selectedGroup }) => {
  const { data: session } = useSession();
  const user = session?.user as User | null;
  const [showProfile, setShowProfile] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowProfile(false);
    }
  };

  const handleUpdateImage = async () => {
    if (image) {
      const response = await updateImage(image);
      if (response && user) {
        user.image = response as string;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-base-300 w-full justify-between fixed top-0 z-10">
      <div className="flex-none">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>
      <div className="text-center">{selectedGroup || 'Star Fly'}</div>

      <div ref={dropdownRef} className="dropdown dropdown-end">
        <div tabIndex={0} className="btn btn-ghost btn-circle avatar online">
          <img alt="User Profile" src={user?.image || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} className="w-10 rounded-full" />
        </div>
        <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-4 shadow">
          {showProfile ? (
            <li className="mb-2">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
                <label className="block text-sm font-semibold mt-2">Alterar foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => setImage(event.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
                <button className={`btn btn-sm btn-outline ${image ? '' : 'btn-disabled'}`} onClick={handleUpdateImage}>Salvar</button>
              </div>
            </li>
          ) : (
            <>
              <li><a onClick={() => setShowProfile(prev => !prev)}>Perfil</a></li>
              <li className="mt-2"><a onClick={() => signOut()} className="text-red-500">Sair</a></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
