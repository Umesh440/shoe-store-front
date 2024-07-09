import React from 'react'
import Wrapper from '@/components/Wrapper'
import ProductCard from '@/components/ProductCard'
import { fetchDataFromApi } from '@/utils/api'
import useSWR from "swr"
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const maxResult = 3;

const Category = ({ category, products, slug }) => {
    const [pageIndex, setPageIndex] = useState(1);

    const { query } = useRouter();

    useEffect(() => {
        setPageIndex(1);
    }, [query])


    const { data, error, isLoading } = useSWR(`/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`, fetchDataFromApi, {
        fallback: products
    })

    return (
        <div className='w-full md:py-8 relative'>
            <Wrapper>

                {!isLoading && (
                    <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
                        <div className="text-[25px] md:text-[30px] mb-5 font-semibold leading-tight">
                            {category?.data?.[0]?.attributes?.name}
                        </div>
                    </div>
                )}


                {/* Products Grid Start */}
                <div className="w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-28 mt-10 px-5 md:px-0">
                    {data?.data?.map((product) => (
                        <ProductCard key={product?.id} data={product} />
                    ))}
                    {/* <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard /> */}
                </div>
                {/* Products Grid End */}

                {/* PAGINATION BUTTONS START */}
                {data?.meta?.pagination?.total > maxResult && (
                    <div className="flex gap-3 items-center justify-center my-10 md:my-0 absolute bottom-[13%] left-[42%]">
                        <button
                            className={`rounded text-[14px] py-[6px] px-5 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
                            disabled={pageIndex === 1}
                            onClick={() => setPageIndex(pageIndex - 1)}
                        >
                            Previous
                        </button>

                        <span className="font-semibold">{`${pageIndex} of ${data && data.meta.pagination.pageCount
                            }`}</span>

                        <button
                            className={`rounded text-[14px] py-[6px] px-5 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
                            disabled={
                                pageIndex ===
                                (data && data.meta.pagination.pageCount)
                            }
                            onClick={() => setPageIndex(pageIndex + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
                {/* PAGINATION BUTTONS END */}

                {isLoading && (
                    <div className="h-[80vh] top-0 left-0 w-full opacity-30 bg-white/[0.5] flex flex-col gap-5 justify-center items-center">
                        <img src="/logo.svg" width={150} className='mt-[-30%]' />
                        <span className="text-[25px] mt-2 font-medium">Loading...</span>
                    </div>
                )}

            </Wrapper>
        </div>
    )
}

export default Category;



export async function getStaticPaths() {
    const category = await fetchDataFromApi("/api/categories?populate=*");

    const paths = category.data.map((c) => ({
        params: {
            slug: c.attributes.slug
        }
    }))

    return {
        paths,
        fallback: false
    }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps({ params: { slug } }) {
    const category = await fetchDataFromApi(`/api/categories?filters[slug][$eq]=${slug}`)
    const products = await fetchDataFromApi(`/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination[page]=1&pagination[pageSize]=${maxResult}`)

    return {
        props: {
            category,
            products,
            slug,
        }
    }
}
