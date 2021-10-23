function $(id) {
    return document.getElementById(id);
}

//Asocio los eventos.
window.addEventListener("load",()=>{

    CargarPersonas();
    let btnLocalidades = document.getElementById("btnLocalidades");
    btnLocalidades.addEventListener("click", CargarLocalidades);
})

//Simula tiempo de carga, para ver el spinner.
var tiempoSpinner = 3000;
var tiempoSpinnerCarga = 500;

///CARGA EL JSON DE PERSONAS DESDE LA API.
function CargarPersonas()
{
    setTimeout( () => 
    {
        var peticion = new XMLHttpRequest(); 
        
        peticion.onreadystatechange = function()
        {
            $("divSpinner").hidden=true; 
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                var personas = JSON.parse(peticion.responseText);
                for (let index = 0; index < personas.length; index++) 
                {
                    newFila(personas[index]);
                }       
            }
        }
        peticion.open("GET","http://localhost:3000/personas",true);
        peticion.send();    
        $("divSpinner").hidden=false;
    }, tiempoSpinnerCarga )
}

//CREA GRILLA DE PERSONAS
function newFila(persona)
{
    var fila = document.createElement("tr");
    var tdId = document.createElement("td");
    var tdNombre = document.createElement("td");
    var tdApellido = document.createElement("td");
    var tdLocalidad = document.createElement("td");
    var tdSexo = document.createElement("td");
    var txtId = document.createTextNode(persona.id);
    var txtNombre = document.createTextNode(persona.nombre);
    var txtApellido = document.createTextNode(persona.apellido);
    var txtLocalidad = document.createTextNode(persona.localidad.nombre);
    var txtSexo = document.createTextNode(persona.sexo);
    fila.appendChild(tdId);
    tdId.appendChild(txtId);
    fila.appendChild(tdNombre);
    tdNombre.appendChild(txtNombre);
    fila.appendChild(tdApellido);
    tdApellido.appendChild(txtApellido);
    fila.appendChild(tdLocalidad);
    tdLocalidad.appendChild(txtLocalidad);
    fila.appendChild(tdSexo);
    tdSexo.appendChild(txtSexo);
    fila.addEventListener("dblclick",modificarPersona);
    $("tabla").appendChild(fila);
}


//METODO DE MODIFICA LOS DATOS DE LA PERSONA.
function modificarPersona(event)
{
    var divPersona=$("divModificarPersona");
    divPersona.hidden = false;

    var tabla = $("tabla");
    var fila = event.target.parentNode; 
    var id = fila.childNodes[0].childNodes[0].nodeValue;
    var nombre = fila.childNodes[1].childNodes[0].nodeValue;
    var apellido = fila.childNodes[2].childNodes[0].nodeValue;
    var localidad = fila.childNodes[3].childNodes[0].nodeValue;
    var sexo = fila.childNodes[4].childNodes[0].nodeValue;

    //Asigno las variables a la ventana.
    $("txtNombre").value = nombre;
    $("txtApellido").value = apellido;
    $("txtLocalidad").value = localidad;
    
    if(sexo == "Female")
    {
        $("female").checked=true;
        $("male").checked=false;
    }else
    {
        $("male").checked=true;
        $("female").checked=false;
    }

    //Si se da el evento click en el boton de modificar, aplico la funcion.
    $("btnModificar").onclick=function()
    {
       
        var nombreOK = true;
        var apellidoOK = true;
        var sexoOK = true;
        
        //Valida el tamaño del nombre.
        if($("txtNombre").value.length <= 3)
        {
            $("txtNombre").style.borderColor="red";          
            nombreOK = false;
        }

        //Valida el tamaño del apellido.
        if($("txtApellido").value.length <= 3)
        {
            $("txtApellido").style.borderColor="red";          
            apellidoOK = false;
        }

        //Valida si esta seleccionado algun sexo.
        if(!($("female").checked || $("male").checked))
        {
            sexoOK = false;
        }

        ActualizarPersonas(nombreOK, apellidoOK, sexoOK);
        
    }

    //Actualiza los datos de una persona.
    function ActualizarPersonas(nombre, apellido, sexo)
    {
        if(nombre && apellido && sexo)
        {
            var nombreNew= $("txtNombre").value;
            var apellidoNew = $("txtApellido").value;
            var localidadNew = $("txtLocalidad").value;
            var sexoNew;
            if($("female").checked)
            {
                sexoNew = "Female";
            }else{
                sexoNew = "Male";
            }
            
            //Creo el Json.
            var jsonPersona =
            {"id":id, 
            "nombre":nombreNew,
            "apellido":apellidoNew,
            "localidad": {"id":17, "nombre":localidadNew},
            "new":sexoNew};
            
            setTimeout( () => 
            {
                //Creo la peticion por POST para actualizar la informacion.
                var peticion = new XMLHttpRequest();
                peticion.onreadystatechange = function() 
                {
                    if(peticion.status == 200 && peticion.readyState == 4)
                    {
                        $("divSpinner").hidden = true;
                        fila.childNodes[1].childNodes[0].nodeValue = nombreNew;
                        fila.childNodes[2].childNodes[0].nodeValue = apellidoNew;
                        fila.childNodes[3].childNodes[0].nodeValue = localidadNew;
                        fila.childNodes[4].childNodes[0].nodeValue = sexoNew; 
                    }
                }
                peticion.open("POST","http://localhost:3000/editar");
                peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                peticion.send(JSON.stringify(jsonPersona));
                $("divSpinner").hidden = false;    

            }, tiempoSpinner )

        } 
    }
}

//Cargar las localidades.
function CargarLocalidades()
{
    setTimeout( () => 
    {
        var peticion = new XMLHttpRequest(); 
        
        peticion.onreadystatechange = function()
        {
            $("divSpinner").hidden=true; 
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                var localidades = JSON.parse(peticion.responseText);
                for (let index = 0; index < localidades.length; index++) 
                {
                    newFilaLocalidades(localidades[index]);
                }       
            }
        }
        peticion.open("GET","http://localhost:3000/localidades",true);
        peticion.send();    
        $("divSpinner").hidden=false;
    }, tiempoSpinnerCarga )
}

//CREA GRILLA DE Localidades
function newFilaLocalidades(localidad)
{
    var fila = document.createElement("tr");
    var tdId = document.createElement("td");
    var tdNombre = document.createElement("td");
    var txtId = document.createTextNode(localidad.id);
    var txtNombre = document.createTextNode(localidad.nombre);

    fila.appendChild(tdId);
    tdId.appendChild(txtId);
    fila.appendChild(tdNombre);
    tdNombre.appendChild(txtNombre);
    $("tablaLocalidades").appendChild(fila);
}
