const fs = require('fs')

class Contenedor{

    constructor(filename){
        this.filename = filename;
    }

    async save(obj){
        let id;
        const contenidoJsonArray = await this.getAll();
        const ultimoId = contenidoJsonArray[contenidoJsonArray.length-1].id;
        obj.id = contenidoJsonArray.length > 0 ? ultimoId + 1 : 1;
        contenidoJsonArray.push(obj);
        try{
            await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
        } catch (err) {
            throw new Error(`Error de escritura: ${err}`);
        }
        console.log(`Producto ${obj.title} con id: ${obj.id} agregado al catálogo`)
        return obj.id;
    }

    async getById(id){                                                  
        
        try{
            const contenidoJsonArray = await this.getAll();
            const producto = contenidoJsonArray.find( (elem) => elem.id == id);
            return producto ? producto : null;
         } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`);
        }
    }
    

    async getAll(){
        try{
            const contenidoStr = await fs.promises.readFile(this.filename, 'utf-8');
            
            const contenidoJsonArray = JSON.parse(contenidoStr);
            
            return contenidoJsonArray;
        } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`)
        }
    }
    
    
    

    async deleteById(id){
        
        const contenidoJsonArray = await this.getAll();
        
        if(contenidoJsonArray.some( elem => elem.id ==id )){

            const index = contenidoJsonArray.findIndex( elem => elem.id == id);
            contenidoJsonArray.splice(index,1);
            try{
            
              await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
              console.log(`Producto con id:${id} borrado`)
            } catch(err) {
                throw new Error(`Error al borrar elemento: ${err}`);
            }

        } else {
            throw new Error('ID ingresado no valido');
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(this.filename, '[]');
            console.log('Catálogo borrado')
        } catch (err){
            throw new Error(`Error al borrar catálogo: ${err}`);
        }

    }

    async changeById(id, nuevo){
        
        const contenidoJsonArray = await this.getAll();
        
        if(contenidoJsonArray.some( elem => elem.id ==id )){
            nuevo.id= id;
            let anterior;
            const index = contenidoJsonArray.findIndex( elem => elem.id == id);
            anterior =contenidoJsonArray[index];

            contenidoJsonArray[index] = nuevo;
            try{
            
                await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
                console.log(`Producto con id:${id} actualizado`)

                return anterior;
              
            } catch(err) {
                throw new Error(`Error al reescribir elemento: ${err}`);
            }

        } else {
            //throw new Error('ID ingresado no valido');
            return null;
        }
    }
    
}

////////////////////// Llamados de prueba ////////////////////////////
///////////////////// Descomentar la línea correspondiente para probar cada uno de los metodos/////

//Instanciación de clase Contenedor
//const productos = new Contenedor('productos.txt');

// Llamado de prueba a metodo getAll()
//productos.getAll().then((catalogo) => console.log('Método getAll(): \n', catalogo) );

// Llamado de prueba a metodo getById()
//productos.getById(2).then((prod) => console.log('Método getById(): \n', prod));


// Llamado de prueba a metodo save()
/*
objProducto = {
    title: 'Guitarra electrica',
    price: 80000,
    thumbnail: '"https://cdn3.iconfinder.com/data/icons/education-209/64/guitarra_electrica.png'
}
*/
//productos.save(objProducto).then( () => {productos.getAll().then( catalogo => console.log('Método save(): Catálogo modificado \n', catalogo))});



// Llamado de prueba a metodo deleteById()  
//productos.deleteById(5).then( () => {productos.getAll().then( (catalogo) => console.log('Método deleteById(): Catálogo modificado \n', catalogo)) });

// Llamado de prueba a metodo deleteAll() 
//productos.deleteAll().then( () => {productos.getAll().then( (catalogo) => console.log('Método deleteAll(): \n Catálogo: \n', catalogo) )})


module.exports= Contenedor;