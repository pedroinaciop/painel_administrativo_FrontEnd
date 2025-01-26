import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Components/NotFoundPage";
import ProductsPage from "./Pages/ProductsPage";
import ProductForm from "./Pages/ProductForm";
import CompanyForm from "./Pages/CompanyPage";
import BasePage from "./Pages/BasePage";
import '@ant-design/v5-patch-for-react-19';
import "./App.css"

function App() {
    return (
      <div className="App">
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<BasePage />}>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route path="/cadastros/usuarios" element={<h1>Oi</h1>}/>
                <Route path="/cadastros/produtos" element={<ProductsPage />} />
                <Route path="/cadastros/produtos/novo" element={<ProductForm/>}/>
                <Route path="/cadastros/empresa" element={<CompanyForm/>}/>
              </Route>
            </Routes>
        </BrowserRouter>
      </div>
    );
} 

export default App;

 