"use client";
import ShoppingWishlist from '@/components/ui/ShoppingWishlist';
import { useParams } from 'next/navigation';


export default function WishlistPage() {
  const params = useParams();
  
  return <ShoppingWishlist />;
}