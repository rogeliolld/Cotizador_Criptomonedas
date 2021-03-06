import React, {useState, useEffect} from "react";
import styled from "@emotion/styled";
import Proptypes from 'prop-types';
import Error from './Error';
import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import axios from "axios";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

  //state del listado de criptomoneda
  const [listacripto, guardarListadocriptomonedas] = useState([]);

  //state para el error
  const [error, guardarError] = useState(false);
  const MONEDAS = [
    { codigo: "USD", nombre: "Dolar de Estados Unidos" },
    { codigo: "MXN", nombre: "Peso Mexicano" },
    { codigo: "EUR", nombre: "Euro" },
    { codigo: "GBP", nombre: "Libra Esterlina" },
  ];

  const [moneda, SelectMoneda] = useMoneda("Elige tu Moneda", "", MONEDAS);

  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Elige Criptomoneda",
    "",
    listacripto
  );

  //Llamado de la API para las opciones de la criptomoneda
    useEffect(() => {
      const consultarApi = async () =>{
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
        const resultado = await axios.get(url);
        guardarListadocriptomonedas(resultado.data.Data);
      }
      consultarApi();
    }, []);

    const cotizarMoneda = e => {
      e.preventDefault();

      //validar si ambos select estan vacios

      if(moneda==='' || criptomoneda===''){
        guardarError(true);
        return;
      }
      //pasar los datos al componente principal
      guardarError(false);
      guardarMoneda(moneda);
      guardarCriptomoneda(criptomoneda);
    }

  return (
    <form
    onSubmit={cotizarMoneda}
    >
      {error ? <Error mensaje="Todos los campos son oblogatorios"/> : null}
      <SelectMoneda />
      <SelectCripto />
      <Boton type="submit" value="Calcular"  />
    </form>
  );
};
Formulario.protoTypes = {
  guardarMoneda: Proptypes.func.isRequired,
  guardarCriptomoneda: Proptypes.func.isRequired,
}
export default Formulario;
