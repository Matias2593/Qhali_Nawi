using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using UnityEngine;
using TMPro;
using UnityEngine.InputSystem;
using Firebase;
using Firebase.Storage;
using Firebase.Extensions;

public class RandomMove : MonoBehaviour
{
    FirebaseStorage storage;
    StorageReference storageReference;

    private Vector3[] positions = new Vector3[] {
        new Vector3(-0.0000f, 4.0000f, 0.0000f),  // Polo norte (tope de la esfera)
        new Vector3(-0.1710f, 3.9397f, -0.2962f),
        new Vector3(-0.1710f, 3.9397f, -0.1710f),
        new Vector3(-0.2962f, 3.9397f, -0.1710f),
        new Vector3(-0.2962f, 3.9397f, -0.2962f)
    };

    public float moveSpeed = 2f;
    private Vector3 targetPosition;
    private Material emissiveMaterial;

    private float[] areaVariations = new float[] { 0.004f }; 
    private float[] intensityVariations = new float[] { 0.1f, 0.2f, 0.5f, 1.0f, 2.0f, 5.0f, 8.0f, 10.0f, 20.0f, 50.0f, 100.0f, 200.0f, 500.0f, 1000.0f }; 
    private float[] intensityArray;

    private int observedCount = 0;
    private int missedCount = 0;
    private bool stimulusObserved = false;
    private float currentIntensity = 0f;

    private int positionIndex = 0;
    private int totalPositions = 10;

    public TextMeshPro messageText;
    public TextMeshPro stimulusText;
    public TextMeshPro debugLogText;

    public InputActionReference rightHandBButton;

    private bool trialStarted = false;
    private string logMessages = "";

    private string nombreArchivo = "intensidades_observadas.txt";

    void Start()
    {
        Debug.Log("Iniciando secuencia de prueba...");
        emissiveMaterial = GetComponent<Renderer>().material;
        storage = FirebaseStorage.DefaultInstance;
        storageReference = storage.GetReferenceFromUrl("gs://eyesaviors.appspot.com");
        StartCoroutine(StartWithDelay());  // Inicia con un retraso de 5 segundos

        // Inicializar el arreglo para guardar las intensidades
        intensityArray = new float[totalPositions];

        // Inicializar el manejo del botón B del mando VR
        if (rightHandBButton != null)
        {
            rightHandBButton.action.Enable();
            rightHandBButton.action.performed += OnBButtonPressed;
        }

        if (stimulusText != null)
        {
            stimulusText.text = "";
        }

        Application.logMessageReceived += HandleLog;
    }

    void Update()
    {
        transform.position = Vector3.MoveTowards(transform.position, targetPosition, moveSpeed * Time.deltaTime);
    }

    // Corrutina que introduce un retraso inicial de 5 segundos
    IEnumerator StartWithDelay()
    {
        Debug.Log("Esperando 5 segundos antes de iniciar el periodo de prueba...");
        yield return new WaitForSeconds(5f);

        Debug.Log("Iniciando el periodo de prueba...");
        StartCoroutine(PreTrialPeriod());
    }

    IEnumerator PreTrialPeriod()
    {
        if (messageText != null)
        {
            messageText.text = "Periodo de prueba";
        }
        Debug.Log("Periodo de prueba iniciado");

        float elapsedTime = 0f;
        float trialDuration = 15f;

        while (elapsedTime < trialDuration)
        {
            targetPosition = GetRandomPosition();
            ChangeEmissiveIntensity();
            GetComponent<Renderer>().enabled = true;
            Debug.Log("Estímulo presentado en posición " + targetPosition);
            
            yield return new WaitForSeconds(0.2f);

            GetComponent<Renderer>().enabled = false;
            yield return new WaitForSeconds(2.0f);
            elapsedTime += 1f;
        }

        if (messageText != null)
        {
            messageText.text = "Se dará inicio a la prueba";
        }
        Debug.Log("Periodo de prueba finalizado, iniciando la prueba principal...");
        
        yield return new WaitForSeconds(2f);
        trialStarted = true;
        StartCoroutine(MoveRandomly());
    }

    IEnumerator MoveRandomly()
    {
        if (messageText != null)
        {
            messageText.text = "";  // Ocultamos el mensaje una vez que comienza la prueba
        }

        Debug.Log("Prueba principal comenzando...");

        while (positionIndex < totalPositions)
        {
            if (Vector3.Distance(transform.position, targetPosition) < 0.01f)
            {
                stimulusObserved = false;
                ChangeEmissiveIntensity();
                ChangeSize();

                GetComponent<Renderer>().enabled = true;
                Debug.Log("Estímulo presentado en " + targetPosition + " con intensidad " + currentIntensity);
                yield return StartCoroutine(WaitForBPress());

                GetComponent<Renderer>().enabled = false;
                yield return new WaitForSeconds(2.3f);

                targetPosition = GetRandomPosition();
                positionIndex++;
            }

            yield return null;
        }

        Debug.Log("Prueba principal finalizada. Procesando resultados...");
        GuardarArchivoTXT();
        CrearYSubirArchivoTXT();
    }

    // Corrutina que espera 1.5 segundos para que se presione el botón B
    IEnumerator WaitForBPress()
    {
        float timer = 1.5f;
        bool buttonPressed = false;

        while (timer > 0)
        {
            if (stimulusObserved)
            {
                intensityArray[positionIndex] = currentIntensity;
                buttonPressed = true;
                break;
            }

            timer -= Time.deltaTime;
            yield return null;
        }

        if (!buttonPressed)
        {
            intensityArray[positionIndex] = 0;
        }
    }

    // Método para obtener una posición aleatoria
    Vector3 GetRandomPosition()
    {
        return positions[Random.Range(0, positions.Length)];
    }

    // Método para cambiar la intensidad emisiva (siempre aleatoria)
    void ChangeEmissiveIntensity()
    {
        currentIntensity = intensityVariations[Random.Range(0, intensityVariations.Length)];
        emissiveMaterial.SetColor("_EmissionColor", Color.white * currentIntensity);
    }

    // Método para cambiar el tamaño del estímulo
    void ChangeSize()
    {
        float selectedArea = areaVariations[Random.Range(0, areaVariations.Length)];
        float radius = Mathf.Sqrt(selectedArea / Mathf.PI);
        transform.localScale = new Vector3(radius * 2, radius * 2, radius * 2);
    }

    // Método llamado cuando se presiona el botón B
    private void OnBButtonPressed(InputAction.CallbackContext context)
    {
        if (trialStarted)
        {
            Debug.Log("Botón B presionado");
            stimulusObserved = true;
            StartCoroutine(ShowStimulusText("Se detectó el estímulo secundario"));
        }
    }

    // Corrutina para mostrar el texto durante 0.8 segundos
    private IEnumerator ShowStimulusText(string message)
    {
        if (stimulusText != null)
        {
            stimulusText.text = message;
            yield return new WaitForSeconds(0.8f);
            stimulusText.text = "";
        }
    }

    // Manejador de mensajes de log para mostrar en pantalla
    private void HandleLog(string logString, string stackTrace, LogType type)
    {
        logMessages += logString + "\n";
        if (debugLogText != null)
        {
            debugLogText.text = logMessages;
        }
    }

    private void OnDestroy()
    {
        if (rightHandBButton != null && rightHandBButton.action != null)
        {
            rightHandBButton.action.performed -= OnBButtonPressed;
        }
        Application.logMessageReceived -= HandleLog;
    }

    // Método para guardar el archivo TXT con las intensidades observadas
    void GuardarArchivoTXT()
    {
        string rutaCarpeta = Path.Combine(Application.persistentDataPath);
        string rutaCompleta = Path.Combine(rutaCarpeta, nombreArchivo);

        try
        {
            if (!Directory.Exists(rutaCarpeta))
            {
                Directory.CreateDirectory(rutaCarpeta);
            }

            string contenidoArchivo = "Intensidades Observadas:\n";
            foreach (var intensidad in intensityArray)
            {
                contenidoArchivo += intensidad.ToString() + "\n";
            }

            File.WriteAllText(rutaCompleta, contenidoArchivo);
            Debug.Log("Archivo guardado en: " + rutaCompleta);
        }
        catch (System.Exception e)
        {
            Debug.LogError("Error al guardar el archivo: " + e.Message);
        }
    }

    void CrearYSubirArchivoTXT()
    {
        string intensidadesTxt = ConvertirArrayATexto(intensityArray);
        string path = Path.Combine(Application.temporaryCachePath, "intensidades_paciente.txt");

        File.WriteAllText(path, intensidadesTxt);

        StorageReference fileReference = storageReference.Child("intensidades_paciente.txt");
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

    string ConvertirArrayATexto(float[] array)
    {
        StringBuilder sb = new StringBuilder();
        foreach (float numero in array)
        {
            sb.AppendLine(numero.ToString());
        }
        return sb.ToString();
    }
}
