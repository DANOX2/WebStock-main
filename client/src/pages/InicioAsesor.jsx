import { useState, useEffect } from 'react';
import axios from 'axios';

const InicioAsesor = () => {

  const [ventas, setVentas] = useState([]);

  const [nuevaVenta, setNuevaVenta] = useState({
    Codigo_venta: '',
    Codigo_producto: '',
    Nombre_cliente: '',
    Telefono_cliente: '',
    Fecha_venta: '',
    Cantidad_vendida: 0,
  });

  const [ventaEditando, setVentaEditando] = useState(null);

  useEffect(() => {
    // Obtener la lista de productos al cargar el componente
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/ventas');
      console.log('API Response:', response.data);
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleInputChange = (e) => {
    console.log('Input Name:', e.target.name);
    console.log('Input Value:', e.target.value);
    setNuevaVenta({ ...nuevaVenta, [e.target.name]: e.target.value });
  };

  const handleAgregarVenta = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/ventas', nuevaVenta);
      console.log('API Response:', response.data);
      const nuevaVentaAgregada = response.data;
      setVentas((prevVentas) => [...prevVentas, nuevaVentaAgregada]);
    } catch (error) {
      console.error('Error al agregar venta:', error);
    }
    setNuevaVenta({
      Codigo_venta: '',
      Codigo_producto: '',
      Nombre_cliente: '',
      Telefono_cliente: '',
      Fecha_venta: '',
      Cantidad_vendida: 0,
    });
  };

  const handleEditarVenta = (venta) => {
    setVentaEditando(venta);
    // You can set the current data of the selected venta in the state for editing
    setNuevaVenta({
      Codigo_venta: venta.Codigo_venta,
      Codigo_producto: venta.Codigo_producto,
      Nombre_cliente: venta.Nombre_cliente,
      Telefono_cliente: venta.Telefono_cliente,
      Fecha_venta: venta.Fecha_venta,
      Cantidad_vendida: venta.Cantidad_vendida,
    });
  };

  const handleGuardarEdicion = () => {
    // Lógica para guardar la edición
    const nuevasVentas = ventas.map((venta) =>
      venta === ventaEditando ? { ...venta, ...nuevaVenta } : venta
    );
    setVentas(nuevasVentas);
    setVentaEditando(null);
    setNuevaVenta({
      Codigo_venta: '',
      Codigo_producto: '',
      Nombre_cliente: '',
      Telefono_cliente: '',
      Fecha_venta: '',
      Cantidad_vendida: 0,
    });
  };

  const handleEliminarVenta = async (Codigo_venta) => {
    try {
      await axios.delete(`http://localhost:5001/api/ventas/${Codigo_venta}`);
      const ventasActualizadas = ventas.filter((venta) => venta.Codigo_venta !== Codigo_venta);
      setVentas(ventasActualizadas);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleCerrarEdicion = () => {
    setVentaEditando(null);
    setNuevaVenta({
      Codigo_venta: '',
      Codigo_producto: '',
      Nombre_cliente: '',
      Telefono_cliente: '',
      Fecha_venta: '',
      Cantidad_vendida: 0,
    });
  };

  const handleCerrarAgregar = () => {
    setNuevaVenta({
      Codigo_venta: '',
      Codigo_producto: '',
      Nombre_cliente: '',
      Telefono_cliente: '',
      Fecha_venta: '',
      Cantidad_vendida: 0,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Tabla de Ventas</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Código</th>
            <th>Código de Producto</th>
            <th>Nombre del Cliente</th>
            <th>Teléfono del Cliente</th>
            <th>Fecha de Venta</th>
            <th>Cantidad Vendida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.Codigo_venta}>
              <td>{venta.Codigo_venta}</td>
              <td>{venta.Codigo_producto}</td>
              <td>{venta.Nombre_cliente}</td>
              <td>{venta.Telefono_cliente}</td>
              <td>{venta.Fecha_venta}</td>
              <td>{venta.Cantidad_vendida}</td>
              <td>
                <button
                  className="btn btn-info btn-sm m-1"
                  onClick={() => handleEditarVenta(venta)}
                  disabled={!!ventaEditando}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm m-1"
                  onClick={() => handleEliminarVenta(venta)}
                  disabled={!!ventaEditando}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaEditando && (
        <>
          <h2>Editar Venta</h2>
          <form>
            <div className="form-group">
              <label>Código de Producto:</label>
              <input
                type="text"
                name="Codigo_producto"
                value={nuevaVenta.Codigo_producto}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Nombre del Cliente:</label>
              <input
                type="text"
                name="Nombre_cliente"
                value={nuevaVenta.Nombre_cliente}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Teléfono del Cliente:</label>
              <input
                type="text"
                name="Telefono_cliente"
                value={nuevaVenta.Telefono_cliente}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Fecha de Venta:</label>
              <input
                type="text"
                name="Fecha_venta"
                value={nuevaVenta.Fecha_venta}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Cantidad Vendida:</label>
              <input
                type="number"
                name="Cantidad_vendida"
                value={nuevaVenta.Cantidad_vendida}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={handleGuardarEdicion}
            >
              Guardar Edición
            </button>
            <button
              type="button"
              className="btn btn-secondary m-2"
              onClick={handleCerrarEdicion}
            >
              Cerrar Edición
            </button>
          </form>
        </>
      )}

      <h2>Añadir Nueva Venta</h2>
      <form>
        <div className="form-group">
          <label>Código de Producto:</label>
          <input
            type="text"
            name="Codigo_producto"
            value={nuevaVenta.Codigo_producto}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Nombre del Cliente:</label>
          <input
            type="text"
            name="Nombre_cliente"
            value={nuevaVenta.Nombre_cliente}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Teléfono del Cliente:</label>
          <input
            type="text"
            name="Telefono_cliente"
            value={nuevaVenta.Telefono_cliente}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Fecha de Venta:</label>
          <input
            type="text"
            name="Fecha_venta"
            value={nuevaVenta.Fecha_venta}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Cantidad Vendida:</label>
          <input
            type="number"
            name="Cantidad_vendida"
            value={nuevaVenta.Cantidad_vendida}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={handleAgregarVenta}
        >
          Añadir Venta
        </button>
        <button
          type="button"
          className="btn btn-secondary m-2"
          onClick={handleCerrarAgregar}
        >
          Limpiar Añadir
        </button>
      </form>
    </div>
  );
};

export default InicioAsesor;