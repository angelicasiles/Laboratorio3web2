import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./Producto";
import { Cabecera_Factura } from "./Cabecera_Factura";

@Entity()
export class Detalle_Factura{
    //PrimaryColumn es para decirle que va a ser una llave primaria
    //PrimaryGeneratedColumn es para decirle que va a ser una llave primaria y que va a ser autoicrementar 
    @PrimaryColumn()
    @ManyToOne (()=> Cabecera_Factura, (cabecera_cliente) => cabecera_cliente.Numero)
    @JoinColumn({name: 'Numero'})
    Numero:number;
    @Column({type: 'int',nullable:true})
    Cantidad:number;
    @ManyToOne(() => Producto, (producto) => producto.Codigo_Productos)
    @JoinColumn({name: 'Codigo_Productos'})
    Codigo_Productos: Producto;
}