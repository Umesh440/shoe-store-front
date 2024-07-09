import React, { useMemo } from 'react'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Wrapper from '@/components/Wrapper';
import CartItem from "@/components/CartItem"
import { useSelector } from "react-redux";
import { loadStripe } from '@stripe/stripe-js';
import { makePaymentRequest } from '@/utils/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Cart = () => {

    const [loading, setloading] = useState(false)

    const { cartItems } = useSelector((state => state.cart))

    const subTotal = useMemo(() => {
        return cartItems.reduce((total, val) => total + val.attributes.price, 0)
    }, [cartItems]);

    const handlePayment = async () => {
        try {
            setloading(true)
            const stripe = await stripePromise;
            const res = await makePaymentRequest("/api/orders", {
                products: cartItems
            });
            await stripe.redirectToCheckout({
                sessionId: res.stripeSession.id,
            });
        } catch (error) {
            setloading(false)
            console.log(error);
        }
    }


    return (
        <div className='w-full md:py-10 min-h-screen'>
            <Wrapper>
                {cartItems.length > 0 && (
                    <>
                        {/* HEADING AND PARAGRAPH START */}
                        <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
                            <div className="text-[23px] md:text-[27px] mb-5 font-semibold leading-tight">
                                Shopping Cart
                            </div>
                        </div>
                        {/* HEADING AND PARAGRAPH END */}


                        {/* CART CONTENT START */}
                        <div className="flex flex-col lg:flex-row gap-12 py-10">

                            {/* CART ITEMS START */}
                            <div className="flex-[2]">
                                <div className="text-base font-bold">
                                    Cart Items
                                </div>
                                {cartItems.map((item) => (
                                    <CartItem key={item.id} data={item} />
                                ))}
                            </div>
                            {/* CART ITEMS END */}

                            {/* SUMMARY START */}
                            <div className="flex-[1] ">
                                <div className="text-base font-bold"> Summary </div>

                                <div className="p-5 my-5 bg-black/[0.05] rounded-xl w-[83%]">
                                    <div className="flex justify-between">
                                        <div className="uppercase text-md md:text-base font-medium text-black">
                                            Subtotal
                                        </div>
                                        <div className="text-md md:text-base font-medium text-black">
                                            &#x20B9; {subTotal}
                                        </div>
                                    </div>
                                    <div className="text-sm md:text-md py-5 border-t mt-2">
                                        The subtotal reflects the total price of
                                        your order, including duties and taxes,
                                        before any applicable discounts. It does
                                        not include delivery costs and
                                        international transaction fees.
                                    </div>
                                </div>

                                {/* BUTTON START */}
                                <button
                                    className="w-[83%] mt-5 h-11 py-4 rounded-full bg-black text-white text-sm font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"
                                    onClick={handlePayment}
                                >
                                    Checkout
                                    {loading && <img src="/spinner.svg" />}
                                </button>
                                {/* BUTTON END */}

                            </div>
                            {/* SUMMARY END */}

                        </div>
                        {/* CART CONTENT END */}
                    </>
                )}


                {/* This is empty screen */}
                {cartItems.length < 1 && <div className="flex-[2] flex flex-col items-center pb-[50px] md:-mt-14">
                    <Image
                        src="/empty-cart.jpg"
                        width={300}
                        height={300}
                        className="w-[300px] md:w-[400px]"
                    />
                    <span className="text-[22px] font-bold">
                        Your Cart Is Empty !
                    </span>
                    <span className="text-center mt-4 text-sm">
                        Looks like you have not added anything in your cart.
                        <br />
                        Go ahead and explore top categories.
                    </span>
                    <Link
                        href="/"
                        className="py-3 h-11 flex justify-center items-center px-9 rounded-full bg-black text-white text-[14px] font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 mt-8"
                    >
                        Continue Shopping
                    </Link>
                </div>}

            </Wrapper>
        </div>
    )
}

export default Cart;
