import HeroBanner from "@/components/HeroBanner"
import Wrapper from "@/components/Wrapper"
import ProductCard from "@/components/ProductCard"
import { fetchDataFromApi } from "@/utils/api";

export default function Home({ products }) {

    return (
        <>
            <main className="">
                <HeroBanner />
                <Wrapper>

                    {/* heading and paragraph Start */}
                    <div className="text-center max-w-[800px] mx-auto my-[45px] md:my-[70px]">
                        <div className="text-[25px] md:text-[30px] mb-5 font-semibold leading-tight">
                            Cushioning For Your Miles
                        </div>
                        <div className="text-[14] md:text-[17px]">
                            A lightweight Nike ZoomX midsole is combined with increased stack heights to help provide cushioning during extended stretches of running
                        </div>
                    </div>
                    {/* heading and paragraph End */}

                    {/* Products Grid Start */}
                    <div className="w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-14 px-5 md:px-0">
                        {products?.data?.map((product) => (
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

                </Wrapper>
            </main>
        </>
    )
}

export async function getStaticProps() {
    const products = await fetchDataFromApi("/api/products?populate=*");

    return {
        props: { products }
    }

}
