import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { AsyncStorage, LogBox } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity,TouchableHighlight ,Modal ,ScrollView, TextInput } from 'react-native';

export default function App() {

  const image = require('./resources/bg.jpg');

  LogBox.ignoreAllLogs(true);

  const [tarefas, setarTarefas] = useState([]);

  const [modal,setModal] = useState(false);

  const [tarefaAtual,setTarefaAtual] = useState('');



  useEffect(()=>{
    //alert('app carregado...');
    
    (async () => {
      try {
        let tarefasAtual = await AsyncStorage.getItem('tarefas');
        if(tarefasAtual == null)
          setarTarefas([]);
        else
          setarTarefas(JSON.parse(tarefasAtual));
      } catch (error) {
        // Error saving data
      }
    })();
    
},[])


  function deletarTarefa(id){
      //alert('Tarefa com id '+id+' foi deletada com sucesso!');
      //TODO: Deletar do array/estado a tarefa com id especificado!
      let newTarefas = tarefas.filter(function(val){
            return val.id != id;
      });

      setarTarefas(newTarefas);
     
      (async () => {
        try {
          await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefas));
          //console.log('chamado');
        } catch (error) {
          // Error saving data
        }
      })();
      
  }

  function addTarefa(){
    
    setModal(!modal);

    let id = 0;
    if(tarefas.length > 0){
        id = tarefas[tarefas.length-1].id + 1;
    }

    let tarefa = {id:id,tarefa:tarefaAtual};

    setarTarefas([...tarefas,tarefa]);

   

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas,tarefa]));
      } catch (error) {
        // Error saving data
      }
    })();
    
  }

 

  return (
    
    <ScrollView style={{flex:1}}>
      <StatusBar hidden />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={{textAlign: 'left'}} placeholder={'Digite aqui'} onChangeText={text => setTarefaAtual(text)} autoFocus={true}></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#cfab7b" }}
              onPress={() => addTarefa()}
            >
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      

        <ImageBackground source={image} style={styles.image}>
          <View style={styles.coverView}>
            <Text style={styles.textHeader}>ToDoList</Text>
            </View>
        </ImageBackground>

      

        {
        tarefas.map(function(val){
          return (<View style={styles.tarefaSingle}>
            <View style={{flex:1,width:'100%',padding:10}}>
                <Text>{val.tarefa}</Text>
            </View>
            <View style={{alignItems:'flex-end',flex:1,padding:10}}>
              <TouchableOpacity onPress={()=> deletarTarefa(val.id)}><AntDesign name="minuscircleo" size={24} color="black" /></TouchableOpacity>
            </View>
            </View>);
        })
        

        }

        <TouchableOpacity style={styles.btnAddTarefa} onPress={()=>setModal(true)}><Text
         style={{textAlign:'center',color:'lightyellow'}}>Adicionar Tarefa!
         </Text>
         </TouchableOpacity>
        
        </ScrollView>
       
  );
}

const styles = StyleSheet.create({
  image: {
    width:'100%',
    height: 80,
    resizeMode: "cover"
  },
  btnAddTarefa:{
    width:200,
    padding:8,
    backgroundColor:'#cfab7b',
    marginTop:20,
    alignSelf: 'center',
    borderRadius: 20,
  },
  coverView:{
    width:'100%',
    height:80,
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  textHeader:{
    textAlign:'center',
    color:'lightyellow',
    fontSize:30,
    alignSelf: 'center',
    marginTop: 20,
  },
  tarefaSingle:{
      marginTop:30,
      width:'100%',
      borderBottomWidth:1,
      borderBottomColor:'black',
      flexDirection:'row',
      paddingBottom:10
  },
  //Estilos para nossa modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex:5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "lightyellow",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }

});
