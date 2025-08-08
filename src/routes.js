import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterLoginUser from "./Pages/RegisterLoginPage";
import NotFoundPage from "./Components/NotFoundPage";
import PrivateRoute from "./Components/PrivateRoute";
import CategoryPage from "./Pages/CategoryPage";
import CategoryForm from "./Pages/CategoryForm";
import ProviderForm from "./Pages/ProviderForm";
import ProviderPage from "./Pages/ProviderPage";
import ProductForm from "./Pages/ProductForm";
import ProductPage from "./Pages/ProductPage";
import CompanyPage from "./Pages/CompanyPage";
import CompanyForm from "./Pages/CompanyForm";
import BasePage from "./Components/BasePage";
import CityPage from "./Pages/CityPage";
import CityForm from "./Pages/CityForm";
import UserForm from "./Pages/UserForm";
import UserPage from "./Pages/UserPage";
import ClientPage from "./Pages/ClientPage";
import ClientForm from "./Pages/ClientForm";

import "@ant-design/v5-patch-for-react-19";
import { SnackbarProvider } from "notistack";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={1} autoHideDuration={3000}> 
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<RegisterLoginUser/>} />
            
              <Route element={<PrivateRoute/>}>
                <Route path="/" element={<BasePage />}>
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/cadastros/usuarios" element={<UserPage/>} />
                  <Route path="/cadastros/usuarios/novo" element={<UserForm/>} />

                  <Route path="/cadastros/produtos" element={<ProductPage />} />
                  <Route path="/cadastros/produtos/novo" element={<ProductForm />} />
                  <Route path="/editar/produtos/:id" element={<ProductForm />} />

                  <Route path="/cadastros/empresas" element={<CompanyPage/>} />
                  <Route path="/cadastros/empresas/novo" element={<CompanyForm />} />
                  <Route path="/editar/empresas/:id" element={<CompanyForm />} />

                  <Route path="/cadastros/fornecedores" element={<ProviderPage />} />
                  <Route path="/cadastros/fornecedores/novo" element={<ProviderForm/>} />
                  <Route path="/editar/fornecedores/:id" element={<ProviderForm/>}/>

                  <Route path="/cadastros/categorias" element={<CategoryPage/>}/>
                  <Route path="/cadastros/categorias/novo" element={<CategoryForm/>}/>
                  <Route path="/editar/categorias/:id" element={<CategoryForm/>}/>

                  <Route path="/cadastros/cidades/" element={<CityPage/>}/>
                  <Route path="/cadastros/cidades/novo" element={<CityForm/>}/>
                  <Route path="/editar/cidades/:id" element={<CityForm/>}/>

                  <Route path="/cadastros/clientes/" element={<ClientPage/>}/>
                  <Route path="/cadastros/clientes/novo" element={<ClientForm/>}/>
                  <Route path="/editar/clientes/:id" element={<ClientForm/>}/>
                </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;