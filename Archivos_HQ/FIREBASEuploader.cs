using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using UnityEngine;
using Firebase;
using Firebase.Firestore;
using Firebase.Storage;
using Firebase.Extensions;

public class FirebaseDB : MonoBehaviour
{
    FirebaseFirestore db;
    FirebaseStorage storage;
    StorageReference storageReference;
    List<int> intensidades2 = new List<int> { 0, 25, 7, 0, 0, 0 }; // Tu arreglo de números

    void Start()
    {
        // Inicializa Firebase y espera a que esté listo antes de continuar
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
        {
            if (task.Result == DependencyStatus.Available)
            {
                // Inicializar Firebase
                FirebaseApp app = FirebaseApp.DefaultInstance;

                // Inicializar Firestore y Storage después de que Firebase esté listo
                db = FirebaseFirestore.DefaultInstance;
                storage = FirebaseStorage.DefaultInstance;
                storageReference = storage.GetReferenceFromUrl("gs://eyesaviors.appspot.com");

                // Obtener datos de Firestore
                ObtenerDatosFirestore();
            }
            else
            {
                Debug.LogError("No se pudieron resolver las dependencias de Firebase: " + task.Result);
            }
        });
    }

    void ObtenerDatosFirestore()
    {
        // Referencia al documento en Firestore (reemplaza con el ID correcto si cambia)
        DocumentReference docRef = db.Collection("examConfigs").Document("9JD2IgUsxUF7EnodMYYp");

        docRef.GetSnapshotAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                DocumentSnapshot snapshot = task.Result;
                if (snapshot.Exists)
                {
                    // Obtener cada campo y mostrarlo en el log
                    string backgroundColor = snapshot.GetValue<string>("backgroundColor");
                    string pattern = snapshot.GetValue<string>("pattern");
                    string stimulusColor = snapshot.GetValue<string>("stimulusColor");
                    string stimulusSize = snapshot.GetValue<string>("stimulusSize");
                    string strategy = snapshot.GetValue<string>("strategy");

                    Debug.Log("Datos obtenidos de Firestore:");
                    Debug.Log("backgroundColor: " + backgroundColor);
                    Debug.Log("pattern: " + pattern);
                    Debug.Log("stimulusColor: " + stimulusColor);
                    Debug.Log("stimulusSize: " + stimulusSize);
                    Debug.Log("strategy: " + strategy);

                    // Llamada a la función para crear y subir el archivo
                    CrearYSubirArchivoTXT();
                }
                else
                {
                    Debug.LogError("El documento no existe en Firestore.");
                }
            }
            else
            {
                Debug.LogError("Error al obtener datos de Firestore: " + task.Exception);
            }
        });
    }

    void CrearYSubirArchivoTXT()
    {
        try
        {
            // Convierte el arreglo en una cadena de texto
            string intensidadesTxt = ConvertirArrayATexto(intensidades2);

            // Ruta persistente para guardar el archivo (más confiable en dispositivos móviles)
            string path = Path.Combine(Application.persistentDataPath, "intensidades26.txt");

            // Escribe el texto en el archivo
            File.WriteAllText(path, intensidadesTxt);
            Debug.Log("Archivo escrito en: " + path);

            // Verificar si el archivo fue creado exitosamente antes de subirlo
            if (File.Exists(path))
            {
                Debug.Log("Archivo guardado correctamente en el dispositivo.");

                // Referencia a Firebase Storage para subir el archivo
                StorageReference fileReference = storageReference.Child("intensidades26.txt");

                // Subir el archivo a Firebase Storage
                fileReference.PutFileAsync(path).ContinueWithOnMainThread(task =>
                {
                    if (task.IsCompleted)
                    {
                        Debug.Log("Archivo TXT subido exitosamente a Firebase Storage.");
                    }
                    else
                    {
                        Debug.LogError("Error al subir archivo a Firebase Storage: " + task.Exception);
                    }
                });
            }
            else
            {
                Debug.LogError("Error: El archivo no se guardó en el dispositivo.");
            }
        }
        catch (System.Exception e)
        {
            Debug.LogError("Error al crear o subir el archivo: " + e.Message);
        }
    }

    string ConvertirArrayATexto(List<int> array)
    {
        StringBuilder sb = new StringBuilder();
        foreach (int numero in array)
        {
            sb.AppendLine(numero.ToString());
        }
        return sb.ToString();
    }
}
