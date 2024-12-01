import { pool } from "../db.js";

// Controladores para la tabla de Ventas

export const getVentas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ventas');
        res.send(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}

export const getVenta = async (req, res) => {
    const codigo = req.params.codigo;
    try {
        const [rows] = await pool.query('SELECT * FROM ventas WHERE codigo = ?', [codigo]);
        if (rows.length <= 0) return res.status(400).json({ message: 'Venta no registrada' });
        res.send(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}

// Inside createVenta controller
export const createVenta = async (req, res) => {
    const { Codigo_producto, Nombre_cliente, Telefono_cliente, Fecha_venta, Cantidad_vendida } = req.body;

    try {
        // Fetch product details to get current stock
        const [productRows] = await pool.query('SELECT * FROM productos WHERE codigo = ?', [Codigo_producto]);
        
        if (productRows.length <= 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const product = productRows[0];
        const currentStock = product.stock;

        if (currentStock < Cantidad_vendida) {
            return res.status(400).json({ message: 'Insufficient stock for the sale.' });
        }

        // Proceed with the sale
        const [saleRows] = await pool.query('INSERT INTO ventas (Codigo_producto, Nombre_cliente, Telefono_cliente, Fecha_venta, Cantidad_vendida) VALUES (?, ?, ?, ?, ?)', [Codigo_producto, Nombre_cliente, Telefono_cliente, Fecha_venta, Cantidad_vendida]);

        // Update product stock in productos table
        const updatedStock = currentStock - Cantidad_vendida;
        await pool.query('UPDATE productos SET stock = ? WHERE codigo = ?', [updatedStock, Codigo_producto]);

        res.send({
            Codigo_producto,
            Nombre_cliente,
            Telefono_cliente,
            Fecha_venta,
            Cantidad_vendida,
            Fecha_venta
        });
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error', error_code: error });
    }
}

export const updateVenta = async (req, res) => {
    const { codigo } = req.params;
    const { Codigo_producto, Nombre_cliente, Telefono_cliente, Fecha_venta, Cantidad_vendida } = req.body;
    try {
        const [result] = await pool.query('UPDATE ventas SET codigoProducto=?, nombreCliente=?, telefono=?, FechaVenta=?, cantidadVendida=?, TotalVenta=? WHERE codigo=?', [Codigo_producto, Nombre_cliente, Telefono_cliente, Fecha_venta, Cantidad_vendida]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Venta no encontrada' });
        const [rows] = await pool.query('SELECT * FROM ventas WHERE codigo=?', [codigo]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}

export const deleteVenta = async (req, res) => {
    const { Codigo_venta } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM ventas WHERE Codigo_venta=?', [Codigo_venta]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Venta no encontrada' });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}