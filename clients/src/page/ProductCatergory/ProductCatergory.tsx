import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import "./ProductCatergory.css"
import { publicAxios } from '../../config/publicAxios';
import { useNavigate, useParams } from 'react-router-dom';
interface Product {
    productId: number;
    nameProduct: string;
    image: string;
    price: number;
    categoryId:number
  }
export default function ProductCatergory( { isLoad }: { isLoad: boolean }) {
    const navigate = useNavigate()
    const {idCategory} = useParams()
    const [products,setProducts]= useState<Product[]>([])
    const [productTotal, setProductTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(6);
    const renderPage = () => {
        const page = [];
        for (let i = 0; i < productTotal; i++) {
          page.push(
            <a
              key={i}
              href="#"
              aria-current="page"
              className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                ${(i + 1) === currentPage ? "bg-indigo-600" : "white"}
                ${(i + 1) === currentPage ? "text-white" : "text-black"}
                `}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </a>
          );
        }
        return page;
      };
    
      const handleUpDownPage = (status: number) => {
        switch (status) {
          case 0:
            setCurrentPage(prevPage => (prevPage === 1 ? productTotal : prevPage - 1));
            break;
          case 1:
            setCurrentPage(prevPage => (prevPage === productTotal ? 1 : prevPage + 1));
            break;
          default:
            break;
        }
      };

    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        let end = start + pageSize;
    
        const fetchData = async () => {
          try {
            const response = await publicAxios.get(`/api/v1/products/category/${idCategory}`);
            console.log(response.data.products);
            

            const data: Product[] = response.data.products;
            
            if (end > data.length) {
              end = data.length;
            }
    
            const newProducts = data.slice(start, end);
            setProducts(newProducts);
            setProductTotal(Math.ceil(data.length / pageSize));
          } catch (error) {
            console.log(error);
          }
        };
        
    
        fetchData();
      }, [currentPage, isLoad,idCategory]);
     
      
    
      const handleClickProduct = (id: number) => {
        localStorage.setItem("idProductDetail", id.toString());
        navigate(`/productDetail/${id}`);
      };
      
      
      console.log(idCategory);
      
      

  return (
    <div>
      <div className='collection-body'>
        {products.map(item => (
          <div className="product-item" key={item.productId} onClick={() => handleClickProduct(item.productId)}>
            <div className="product-img">
              <a><img src={item.image} alt="img" /></a>
            </div>
            <div className="product-detail font-sans">
              <h3><a>{item.nameProduct}</a></h3>
            </div>
            <div className="box-pro-prices">
              <span>{Number(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a
                onClick={() => handleUpDownPage(0)}
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              {renderPage()}
              <a
                onClick={() => handleUpDownPage(1)}
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>    
  )
}
