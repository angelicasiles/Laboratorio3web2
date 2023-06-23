import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Detalle_Factura} from "../entity/Detalle_Factura";
import { Cabecera_Factura } from "../entity/Cabecera_Factura";

class Detalle_FacturasController {

    static getAll = async (req: Request, resp: Response) => {

         //Creamos el trycatch, para que el server no se caiga en posible error.
         try {
            //Creamos metodo de GetAll, Creamos instancia de AppDataSource.
            const DetFacRepo = AppDataSource.getRepository(Detalle_Factura)
            const CabeRepo = AppDataSource.getRepository(Cabecera_Factura)
            //Siempre vamos a usar un await, await = espere
            //Dentro del Find, podemos crear una condicion. Por ejemplo : 
            //find({where: {estado:true}})
            const ListaDetFacRepo = await DetFacRepo.find();
            const ListaCabeRepo = await CabeRepo.find();

            //Creamos validacion para ver si hay datos en la tabala
            if ( ListaCabeRepo.length == 0 && ListaDetFacRepo.length == 0) {
                return resp.status(404).json({ mensaje: 'No existe ninguna factura en la base de datos' })
            }
            return resp.status(200).json([ListaCabeRepo,ListaDetFacRepo]);
        } catch (error) {
            //En posible error, lo que hacemos es devolver el error
            return resp.status(400).json({ mensaje: error.error });
        }

        

    }
    static getById = async (req: Request, resp: Response) => {
        //let  delFac: Detalle_Factura
       
         try {
            
            const Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(404).json({ mensaje: 'No se indica el ID' })
            }
            
            const enconRepoDeta = AppDataSource.getRepository(Detalle_Factura);
            const enconRepoCabe = AppDataSource.getRepository(Cabecera_Factura)
            let encontrar, encontrar1;

            // Podemos utilizar tambien el trycatch, y asi nos ahorramos el if
            try {
                //Utilizamos el findOneOrFail, para que cree una exepcion en caso de que no
                // Encuentre
                //let delfa = delFac.Numero
                encontrar = await enconRepoCabe.findOneOrFail({ where: { Numero} })
                encontrar1 = await enconRepoDeta.findOneOrFail({ where: {Numero} })

            } catch (error) {
                return resp.status(404).json({ mensaje: 'No se encontro una factura con ese ID' })
            }
            
            // const producto = await ProductosRepo.findOne({ where: { Codigo_Producto } })
            // //Validamos producto tiene algo
            // if (!producto) {
            //     return resp.status(404).json({ mensaje: 'No se encontro el producto con ese ID' })
            // }

            // //En caso de que si alla algo, lo mande
            return resp.status(200).json({ encontrar,encontrar1 })

        } catch (error) {
            //En posible error, lo que hacemos es devolver el error
            return resp.status(400).json({ mensaje: error.error });
        }
    }
    static add = async (req: Request, resp: Response) =>{
    try {
        // Destructuring
        // De esa manera estamos sacando del body esos datos:
        const {Numero,Fecha,Ruc_Cliente,CodigoProveedor,Cantidad,Codigo_Productos} = req.body;
        //ValCodigo_Productoamos los datos de entrada
        if(!Numero){
            return resp.status(404).json({ mensaje: 'Debe indicar el Numero' })
        }
        if(!Fecha){
            return resp.status(404).json({ mensaje: 'Debe indicar la fecha' })
        }
        if(!Ruc_Cliente){
            return resp.status(404).json({ mensaje: 'Debe indicar el Ruc_Cliente' })
        }
        if(!CodigoProveedor){
            return resp.status(404).json({ mensaje: 'Debe indicar el Codigo Proveedor' })
        }
        if(!Cantidad){
            return resp.status(404).json({ mensaje: 'Debe indicar la cantidad' })
        }
        if(Cantidad<0){
            return resp.status(404).json({ mensaje: 'Debe indicar la Cantidad mayor que 0' })
        }
        if(!Codigo_Productos){
            return resp.status(404).json({ mensaje: 'Debe indicar el Codigo_Productos' })
        }
        
        //Hacemos la instancia del repositorio
        const CabeRepo = AppDataSource.getRepository(Cabecera_Factura);
        const DellRepo = AppDataSource.getRepository(Detalle_Factura);
        let Cabecera, Detalles;

        
        Cabecera = await CabeRepo.findOne({ where: { Numero }})
        Detalles = await DellRepo.findOne({ where: { Numero }})

        // Validamos si el producto esta en la base de datos
        if(Cabecera && Detalles ){
            return resp.status(404).json({ mensaje: 'La factura ya esta en la base de datos' })
        }

        //Creamos el nuevo producto
        let CabeceraFactura = new Cabecera_Factura();
        let DetallesFactura = new Detalle_Factura();

        CabeceraFactura.Numero = Numero;
        CabeceraFactura.Fecha = Fecha;
        CabeceraFactura.Ruc_Cliente = Ruc_Cliente;
        CabeceraFactura.CodigoProveedor = CodigoProveedor;
        DetallesFactura.Numero = Numero;
        DetallesFactura.Cantidad = Cantidad;
        DetallesFactura.Codigo_Productos = Codigo_Productos;
        //Guardamos
        await CabeRepo.save(CabeceraFactura);
        await DellRepo.save(DetallesFactura);
        return resp.status(200).json({ mensaje: 'Factura Creada' });


        } catch (error) {

            return resp.status(400).json({mensaje:error})
    }
}
    static update = async (req: Request, resp: Response) => {

        let numero; 
        numero = parseInt(req.params[numero]);

        // Destructuring
        // De esa manera estamos sacando del body esos datos:
        const { Numero,Fecha, Ruc_Cliente, CodigoProveedor} = req.body;

        //Validamos los datos de entrada
        if (!Numero) {
            return resp.status(404).json({ mensaje: 'Debe indicar el Numero' })
        }
        if (!Fecha) {
            return resp.status(404).json({ mensaje: 'Debe indicar la Fecha' })
        }
        if (!Ruc_Cliente) {
            return resp.status(404).json({ mensaje: 'Debe indicar el Ruc_Cliente' })
        }
        if (!CodigoProveedor) {
            return resp.status(404).json({ mensaje: 'Debe indicar el Codigo_Vendedor' })
        }
        //Validamos los datos de entrada
        const {Cantidad,Codigo_Productos} = req.body;
        if (!Cantidad) {
            return resp.status(404).json({ mensaje: 'Debe indicar la cantidad' })
        }
        if (Cantidad<0) {
            return resp.status(404).json({ mensaje: 'La cantidad debe de ser mayor a 0' })
        }
        if (!Codigo_Productos) {
            return resp.status(404).json({ mensaje: 'Debe indicar el producto' })
        }


        // Validaciones de reglas de negocio
        const CabeaRepo = AppDataSource.getRepository(Cabecera_Factura);
        const DetaRepo = AppDataSource.getRepository(Detalle_Factura);


        //Buscamoms el producto en la base de datos, para ver si existe
        //Creamos una variable diciendo que va a ser de tipo Producto.
        let pro1;
        try {
            //ELegimos metodo findOneOrFail para buscar el id y si no lo encuentra.
            //Va a producir un error y el catch lo va a capturar ese error
            pro1 = await CabeaRepo.findOneOrFail({ where: { Numero:numero} })
            pro1 = await DetaRepo.findOneOrFail({ where: { Numero: numero} })

        } catch (error) {
            return resp.status(404).json({ mensaje: 'No existe el producto' })
        }
        let pro : Cabecera_Factura ;
        let pro4 :Detalle_Factura ;
        pro.Numero= Numero;
        pro.Fecha = Fecha;
        pro.Ruc_Cliente = Ruc_Cliente;
        pro.CodigoProveedor = CodigoProveedor;
        pro4.Cantidad=Cantidad;
        pro4.Numero= Numero;
        pro4.Codigo_Productos=Codigo_Productos;
        
        

        try {
            await CabeaRepo.save(pro)
            await DetaRepo.save(pro4)

            return resp.status(200).json({ mensaje: 'Se guardo correctamente' })
        } catch (error) {
            return resp.status(400).json({ mensaje: 'No se pudo guardar'})
        }
    }
    static delete = async (req: Request, resp: Response) => {

        let Numero;
        try {
            Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(400).json({ mensaje: 'Debe indicar el numero' })
            }

            const DetRepo = AppDataSource.getRepository(Detalle_Factura);
            let Factura;
            try {
                Factura = await DetRepo.findOne({ where: { Numero } })
            } catch (error) {
                return resp.status(404).json({ mensaje: 'No se encuentra en la base de datos' })
            }
            try {
                await DetRepo.delete(Factura)
                return resp.status(200).json({ mensaje: 'Se elimino correctamente' })
            } catch (error) {
                return resp.status(400).json({ mensaje: 'No se pudo eliminar' })
            }

        } catch (error) {
            return resp.status(404).json({ mensaje: 'No se pudo eliminar' })
        }




    }
}
export default Detalle_FacturasController;