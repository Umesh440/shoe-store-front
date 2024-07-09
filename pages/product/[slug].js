import React from 'react'
import Wrapper from '@/components/Wrapper'
import { IoMdHeartEmpty } from "react-icons/io"
import ProductDetailsCarousel from '@/components/ProductDetailsCarousel'
import RelatedProducts from '@/components/RelatedProducts'
import { fetchDataFromApi } from '@/utils/api'
import { getDiscountedPricePercentage } from '@/utils/helper'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '@/store/cartSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = ({ product, products }) => {

    const p = product?.data?.[0]?.attributes;

    const [selectedSize, setselectedSize] = useState();
    const [showError, setshowError] = useState(false);

    const dispatch = useDispatch()

    const notify = () => {
        toast.success('Product added into Cart', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    return (
        <div className='w-full md:py-16'>
            <ToastContainer />
            <Wrapper >

                <div className='flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]'>
                    {/* left column start */}
                    <div className="left w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
                        <ProductDetailsCarousel images={p.image.data} />
                    </div>
                    {/* left column end */}



                    {/* right column start */}
                    <div className="right flex-[1] py-3 ml-[-10%]">
                        {/* Product Title  */}
                        <div className='text-[27px] font-semibold mb-2'>
                            {p.name}
                        </div>

                        {/* Product Sub-Title  */}
                        <div className="text-base font-semibold mb-6">
                            {p.subtitle}
                        </div>

                        {/* Product Price*/}
                        <div className='flex items-center mb-1 text-black/[0.5]'>
                            <p className='mr-2 text-base font-semibold text-gray-700'>
                                MRP : &#8377; {p.price}
                            </p>

                            {p.original_price && (
                                <>
                                    <p className='text-sm font-medium line-through'>
                                        &#8377; {p.original_price}
                                    </p>
                                    <p className="ml-24 text-sm font-medium text-green-500">
                                        {getDiscountedPricePercentage(p.original_price, p.price)}% off
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="text-[13px] font-medium text-black/[0.5]">
                            incl. of taxes
                        </div>
                        <div className="text-[13px] font-medium text-black/[0.5] mb-12">
                            {`(Also includes all applicable duties)`}
                        </div>

                        {/* PRODUCT SIZE RANGE START */}
                        <div className="mb-10">
                            {/* HEADING START */}
                            <div className="flex justify-between mb-2">
                                <div className="text-[14px] font-semibold">
                                    Select Size
                                </div>
                                <div className="text-[14px] font-medium text-black/[0.5] cursor-pointer">
                                    Select Guide
                                </div>
                            </div>
                            {/* HEADING END */}

                            {/* SIZE START */}
                            <div id="sizesGrid" className="grid grid-cols-3 gap-2">
                                {p.size.data.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`border w-[85%] rounded-md text-center py-2 font-medium text-[14px] 
                                            ${item.enabled ? "hover:border-black cursor-pointer" : "cursor-not-allowed bg-black/[0.1] opacity-50"}
                                            ${selectedSize === item.size ? "border-red-500" : ""}
                                        `}

                                        onClick={() => {
                                            setselectedSize(item.size)
                                            setshowError(false)
                                        }}
                                    >
                                        {item.size}
                                    </div>
                                ))}
                            </div>
                            {/* SIZE END */}

                            {/* SHOW ERROR START */}
                            {showError &&
                                <div className="text-red-600 mt-2 font-semibold text-[13px]">
                                    Size selection is required
                                </div>
                            }
                            {/* SHOW ERROR END */}

                        </div>
                        {/* PRODUCT SIZE RANGE END */}

                        {/* ADD TO CART BUTTON START */}
                        <button className="w-[85%] h-[45px] py-4 rounded-full bg-black text-white text-sm font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex justify-center items-center"
                            onClick={() => {
                                if (!selectedSize) {
                                    setshowError(true)
                                    document.getElementById("sizesGrid").scrollIntoView({
                                        block: "center",
                                        behavior: "smooth"
                                    })
                                } else {
                                    dispatch(addToCart({
                                        ...product?.data?.[0],
                                        selectedSize,
                                        oneQuantityPrice: p.price,
                                    }));
                                    notify()
                                }
                            }}
                        >
                            Add to Cart
                        </button>
                        {/* ADD TO CART BUTTON END */}

                        {/* WHISHLIST BUTTON START */}
                        <button className="w-[85%] h-[45px] py-4 rounded-full border border-black text-sm font-semibold transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">
                            Whishlist
                            <IoMdHeartEmpty size={15} />
                        </button>
                        {/* WHISHLIST BUTTON END */}

                        <div className='w-[95%]'>
                            <div className="text-lg font-bold mb-4">
                                Product Details
                            </div>
                            <div className="text-[15px] mb-4">
                                {p.description}
                            </div>
                        </div>

                    </div>
                    {/* right column end */}
                </div>

                <RelatedProducts products={products} />

            </Wrapper>
        </div>
    )
}

export default ProductDetails;

export async function getStaticPaths() {
    const products = await fetchDataFromApi("/api/products?populate=*");

    const paths = products.data.map((p) => ({
        params: {
            slug: p.attributes.slug
        }
    }))

    return {
        paths,
        fallback: false
    }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps({ params: { slug } }) {
    const product = await fetchDataFromApi(`/api/products?populate=*&filters[slug][$eq]=${slug}`)
    const products = await fetchDataFromApi(`/api/products?populate=*&[filters][slug][$ne]=${slug}`)

    return {
        props: {
            product,
            products
        }
    }
}

