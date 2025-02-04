import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Components/NotFoundPage";
import CategoryPage from "./Pages/CategoryPage";
import CategoryForm from "./Pages/CategoryForm";
import ProductsPage from "./Pages/ProductsPage";
import ProviderForm from "./Pages/ProviderForm";
import ProviderPage from "./Pages/ProviderPage";
import ProductForm from "./Pages/ProductForm";
import CompanyPage from "./Pages/CompanyPage";
import CompanyForm from "./Pages/CompanyForm";
import BasePage from "./Components/BasePage";
import "@ant-design/v5-patch-for-react-19";
import UserForm from "./Pages/UserForm";
import UserPage from "./Pages/UserPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BasePage />}>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/cadastros/usuarios" element={<UserPage/>} />
            <Route path="/cadastros/usuarios/novo" element={<UserForm/>} />

            <Route path="/cadastros/produtos" element={<ProductsPage />} />
            <Route path="/cadastros/produtos/novo" element={<ProductForm />} />

            <Route path="/cadastros/empresa" element={<CompanyPage/>} />
            <Route path="/cadastros/empresa/novo" element={<CompanyForm />} />

            <Route path="/cadastros/fornecedores" element={<ProviderPage />} />
            <Route path="/cadastros/fornecedores/novo" element={<ProviderForm/>} />

            <Route path="/cadastros/categorias" element={<CategoryPage/>}/>
            <Route path="/cadastros/categorias/novo" element={<CategoryForm/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
