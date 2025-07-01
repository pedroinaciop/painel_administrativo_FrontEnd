import AutocompleteField from '../../Components/AutocompleteField/AutocompleteField';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../../Components/InputField';
import FooterForm from '../../Components/FooterForm'
import HeaderForm from '../../Components/HeaderForm'
import { useEffect, useState } from 'react';
import styled from './CityForm.module.css';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import api from '../../services/api'
import { z } from 'zod';


const CityForm = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const updateDate = new Date();
    const { enqueueSnackbar } = useSnackbar();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

    const createCitySchema = z.object({
        nome_cidade: z.string()
            .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Caracter inválido informado")
            .nonempty("Campo obrigatório"),

        uf: z.string()
        .nonempty("Campo obrigatório"),

        codigo_ibge: z.number({
            required_error: "Campo obrigatório",
            invalid_type_error: "Campo obrigatório"
        })
            .int()
            .nonnegative(),

        codigo_pais: z.string()
            .nonempty("Campo obrigatório"),
    });

    const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm({
        resolver: zodResolver(createCitySchema)
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createCity = (data) => {
        console.log(data)
        api.post("cadastros/cidades/novo", {
            cityName: data.nome_cidade.toUpperCase(),
            uf: data.uf,
            ibgeCode: data.codigo_ibge,
            countryCode: data.codigo_pais,
            createDate: formattedDate,
            createUser: sessionStorage.getItem("user"),
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                navigate('/cadastros/cidades');
            }).catch(function (error) {
                if (api.isAxiosError(error)) {
                    if (error.response) {
                        enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                    } else if (error.request) {
                        enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                    } else {
                        enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                    }
                } else {
                    enqueueSnackbar("Erro inesperado", { variant: "error" });
                }
            })
    };

    const editCity = (data) => {
        api.put(`/editar/cidades/${id}`, {
                nome_cidade: data.cityName,
                uf: data.uf,
                codigo_ibge: data.ibgeCode,
                codigo_pais: data.countryCode,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                navigate('/cadastros/cidades');
            }).catch(function (error) {
                if (api.isAxiosError(error)) {
                    if (error.response) {
                        enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                    } else if (error.request) {
                        enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                    } else {
                        enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
                    }
                } else {
                    enqueueSnackbar("Erro inesperado", { variant: "error" });
                }
            })
    };

    useEffect(() => {
    if (id) {
        setLoading(true);
        api.get(`/editar/cidades/${id}`)
            .then(response => {
                const city = response.data;  
                console.log(city);
                reset({
                    nome_cidade: city.cityName,
                    uf: city.uf,
                    codigo_ibge: city.ibgeCode,
                    codigo_pais: city.countryCode,

                    updateDate: city.updateDate,
                    updateUser: city.updateUser,

                    createDate: city.createDate,
                    createUser: city.createUser,
                });
            })
            .catch(error => {
                enqueueSnackbar("Erro ao carregar cidades", { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right"}});
            })
            .finally(() => setLoading(false));
        }
    }, [id]);

    const countries = [
        { code: '1058', label: 'Brasil' },
    ];

    const brasilStates = [
        { code: 'AC', label: 'Acre' },
        { code: 'AL', label: 'Alagoas' },
        { code: 'AP', label: 'Amapá' },
        { code: 'AM', label: 'Amazonas' },
        { code: 'BA', label: 'Bahia' },
        { code: 'CE', label: 'Ceará' },
        { code: 'DF', label: 'Distrito Federal' },
        { code: 'ES', label: 'Espírito Santo' },
        { code: 'GO', label: 'Goiás' },
        { code: 'MA', label: 'Maranhão' },
        { code: 'MT', label: 'Mato Grosso' },
        { code: 'MS', label: 'Mato Grosso do Sul' },
        { code: 'MG', label: 'Minas Gerais' },
        { code: 'PA', label: 'Pará' },
        { code: 'PB', label: 'Paraíba' },
        { code: 'PR', label: 'Paraná' },
        { code: 'PE', label: 'Pernambuco' },
        { code: 'PI', label: 'Piauí' },
        { code: 'RJ', label: 'Rio de Janeiro' },
        { code: 'RN', label: 'Rio Grande do Norte' },
        { code: 'RS', label: 'Rio Grande do Sul' },
        { code: 'RO', label: 'Rondônia' },
        { code: 'RR', label: 'Roraima' },
        { code: 'SC', label: 'Santa Catarina' },
        { code: 'SP', label: 'São Paulo' },
        { code: 'SE', label: 'Sergipe' },
        { code: 'TO', label: 'Tocantins' },
    ];

    const updateDateField = watch("updateDate");
    const updateUserField = watch("updateUser");
    const createUserField = watch("createUser");
    const createDateField = watch("createDate");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={id ? "Atualizar Cidade" : "Nova Cidade"} />
            <form onSubmit={id ? handleSubmit(editCity) : handleSubmit(createCity)} onKeyDown={handleKeyDown} autoComplete="off">
                <div className={styled.row}>
                    <InputField
                        idInput="nome_cidade"
                        idDiv={styled.cityNameField}
                        label="Cidade*"
                        type="text"
                        maxLength={35}
                        register={register}
                        error={errors?.nome_cidade}
                    />

                    <AutocompleteField
                        name="uf"
                        control={control}
                        label="UF*"
                        options={brasilStates}
                        error={errors?.uf}
                        defaultValue={'SP'}
                    />
                </div>

                <div className={styled.row}>
                    <InputField
                        idInput="codigo_ibge"
                        idDiv={styled.ibgeCodeField}
                        label="CÓDIGO IBGE*"
                        type="text"
                        register={register}
                        error={errors?.codigo_ibge}
                    />

                    <AutocompleteField
                        name="codigo_pais"
                        control={control}
                        label="PAÍS*"
                        options={countries}
                        error={errors?.codigo_pais}
                    />
                 </div>
                <FooterForm title={id ? "Atualizar" : "Adicionar"} updateDateField={updateDateField} updateUserField={updateUserField} createUserField={createUserField} createDateField={createDateField}/>
            </form>
        </section>
    );
};

export default CityForm;