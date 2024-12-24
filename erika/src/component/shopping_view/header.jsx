import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { shoppingViewHeaderMenuItems } from '@/config';
import { Logout } from '@/store/auth-slice';
import logo from "../../assets/logo erika.png";
import { CircleUserRound, HousePlug, LogOut, Menu, Search, ShoppingCart, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import UserCartWrapper from './cart-wrappper';
import { fetchCartItem } from '@/store/shop/cart-slice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newKeyword, setNewKeyword] = useState('');

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem('filters');
    const currentFilter = !['home', 'products', 'search', 'about', 'contact'].includes(getCurrentMenuItem.id)
      ? { category: [getCurrentMenuItem.id] }
      : null;

    sessionStorage.setItem('filters', JSON.stringify(currentFilter));

    if (location.pathname.includes('Listing') && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }
  }

  useEffect(() => {
    if (newKeyword && newKeyword.trim().length > 3) {
      localStorage.setItem('sendKeyword', newKeyword);
      navigate('/shop/search');
    }
  }, [newKeyword]);

  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row flex-col-reverse'>
      <div className='flex flex-col gap-4 lg:flex-row'>
      {shoppingViewHeaderMenuItems.map(menuItem => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className='text-sm font-medium cursor-pointer hover:text-[#007000] text-black'
        >
          {menuItem.label}
        </Label>
      ))}
      </div>

      <div className="flex justify-center items-center bg-[#007000] px-3 py-3 rounded-md">
        <Input
          value={newKeyword}
          name="keyword"
          onChange={(event) => setNewKeyword(event.target.value)}
          placeholder="Search Products..."
        />
        <Search className="w-6 h-6 mx-2 text-white font-bold" />
      </div>
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector(state => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(Logout());
    navigate('/shop/home')
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItem(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button className="relative" variant="outline" size="icon" onClick={() => setOpenCartSheet(true)}>
          <ShoppingCart className='w-6 h-6 text-black' />
          <span className='absolute top-[-5px] right-[2px] font-bold text-sm text-black'>
            {user?.id ? cartItems?.items?.length || 0 : 0}
          </span>
          <span className='sr-only'>User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>
      
      {user?.id ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback className="bg-[#007000] text-white font-extrabold font-serif cursor-pointer">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56 bg-white">
            <DropdownMenuLabel>
              Logged in as {user.username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <User className='mr-2 h-4 w-4' /> Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4' /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="text-white bg-[#007000] shadow-2xl shadow-green-500" onClick={() => navigate("/auth/login")}>LogIn</Button>
      )}
    </div>
  );
}


const Shop_header = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background bg-white'>
    <div className='flex h-16 items-center justify-between px-4 md:py-6'>
      <Link to='/shop/home' className='flex items-center gap-2'>
        <img src={logo} alt="logo" className='h-[55px] w-[140px]' />
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className='h-6 w-6' />
            <span className='sr-only'>Toggle Header Menu</span>
          </Button>
        </SheetTrigger>
         <SheetContent side="left" className='w-full max-w-xs bg-white text-black '>
         
          <MenuItems />
          <HeaderRightContent />         
        </SheetContent>
      </Sheet>
      <div className='hidden lg:block'>
        <MenuItems />
      </div>
      <div className='hidden lg:block'>
        <HeaderRightContent />
      </div>
    </div>
  </header>
  
  );
}

export default Shop_header;
