import { TextField } from "@mui/material";
import React, {useState} from "react";
import Select from "react-select"
import makeAnimated from 'react-select/animated';

const options = [
    { value: 'BRL', label: 'Real' },
    { value: 'USD', label: 'Dólar Americano' },
    { value: 'EUR', label: 'EURO' }
];

const animatedComponents = makeAnimated();

const Conversor = () => {
    const [moedaOrigem, setMoedaOrigem] = useState([]);
    const [moedaDestino, setMoedaDestino] = useState([]);
    const [valor, setValor] = useState(0);
    
    const converter = () => {};

    return (
        <div>
            <div>
                <Select options={options} value={moedaOrigem} closeMenuOnSelect={false} isMulti components={animatedComponents} onChange={setMoedaOrigem} label="Moeda Origem"></Select>
                <TextField type="number" value={valor} onChange={e => setValor(e.target.value)}></TextField>
                <Select options={options} value={moedaDestino} closeMenuOnSelect={false} isMulti components={animatedComponents} onChange={setMoedaDestino} label="Moeda Destino"></Select>
            </div>
            <div>
                <button onClick={converter}>Converter</button>
            </div>
        </div>
    );
};

export default Conversor;