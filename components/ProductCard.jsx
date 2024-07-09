import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { getDiscountedPricePercentage } from '@/utils/helper'

const ProductCard = ({ data: { attributes: p, id } }) => {
    return (
        <Link href={`/product/${p.slug}`}
            className='transform overflow-hidden bg-white duration-200 hover:scale-105 cursor-pointer'>

            <Image
                width={290}
                height={290}
                src={p.thumbnail.data.attributes.url}
                alt={p.name}
            >

            </Image>

            <div className='py-4  text-black/[0.9]'>
                <h2 className='text-[17px] font-medium'>{p.name}</h2>
                <div className='flex items-center mb-8 text-black/[0.5]'>
                    <p className='mr-2 text-base font-semibold'>
                        &#8377; {p.price}
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
            </div>
        </Link>
    )
}

export default ProductCard
