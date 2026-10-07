import { Routes, Route } from 'react-router-dom';
import Home from './home.jsx';
import Registre from './registre.jsx';
import Pagetache from './pagetache.jsx';
import Listtache from'./listtache.jsx';


const RouterComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/registre" element={<Registre/>} />
            <Route path="/pagetache" element={<Pagetache/>} /> 
            <Route path='/listtache' element={<Listtache/>}  /> 
        </Routes>
    );
};

export default RouterComponent;