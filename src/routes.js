import "@ant-design/v5-patch-for-react-19";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Components/NotFoundPage";
import ProductsPage from "./Pages/ProductsPage";
import ProductForm from "./Pages/ProductForm";
import CompanyForm from "./Pages/CompanyPage";
import BrandForm from "./Pages/BrandForm";
import BrandPage from "./Pages/BrandPage";
import CategoryPage from "./Pages/CategoryPage";
import CategoryForm from "./Pages/CategoryForm";
import BasePage from "./Pages/BasePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BasePage />}>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/cadastros/usuarios" element={<h1>Oi</h1>} />
            <Route path="/cadastros/produtos" element={<ProductsPage />} />
            <Route path="/cadastros/produtos/novo" element={<ProductForm />} />
            <Route path="/cadastros/empresa" element={<CompanyForm />} />
            <Route path="/cadastros/fornecedores" element={<BrandPage />} />
            <Route path="/cadastros/fornecedores/novo" element={<BrandForm/>} />
            <Route path="/cadastros/categorias" element={<CategoryPage/>}/>
            <Route path="/cadastros/categorias/novo" element={<CategoryForm/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
