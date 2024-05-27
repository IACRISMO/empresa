const { OpenAIApi, Configuration} = require('openai');

// node --version # Should be >= 18
// npm install @google/generative-ai
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

// 

async function getMessageChatGPT(text){
    //
    //
    const configuration = new Configuration(
        {
            apiKey: '',
            organization: '',
        }
    );

    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: text,
    });

    if(response.status == '200' && response.data.choices.length > 0)
     return response.data.choices[0].text;

     return null;

};

async function getMessageGemini(text_) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = text_;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('respuesta gemini',text);
    return text;
    // return response.text();
};

async function getMessageGeminiInstance_(text_) {

    let systemInstruction_ = "Hola eres un asistente virtual de mi empresa Polivet , es una veterinaria que bindra varios servicios y deseo que el mensaje sea con ese estilo y muy bonito, no puedes hablar de otra cosa.";
    systemInstruction_ += "y tendras que pedir nombres completos y dni";

    const MODEL_NAME = "gemini-1.5-pro-latest";
    const API_KEY = "AIzaSyC9CBjIX0JDxf9X7_hylgwRhbopZQzpoLs";

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME ,
        systemInstruction: systemInstruction_ 
        });
  
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      // history: [
      //   {
      //     role: "user",
      //     parts: [{ text: "Hola"}],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "Hola, ¿en qué te puedo ayudar?  😊"}],
      //   },
      //   {
      //     role: "user",
      //     parts: [{ text: "Quisiera saber sobre el proceso de ventas"}],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "¡Claro! Con gusto te puedo ayudar con eso.  😊\n\n¿Sobre qué parte del proceso de ventas te gustaría saber? \n\nPuedo explicarte cómo agregar productos al pedido, cómo editar mensajes, enviar el pedido y más."}],
      //   },
      //   {
      //     role: "user",
      //     parts: [{ text: "como le agrego un mensaje adicion a mi plato"}],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "¡Por supuesto! Agregar un mensaje adicional a tu plato es muy sencillo. Sigue estos pasos: \n\n**2.1.- Selecciona el plato y da clic en \"editar mensaje\".**\n\n**2.2.- Escoge una de las opciones o escribe tu propio mensaje.** \n\n¡Y listo! Tu mensaje se agregará al plato.  \n\n¿Te gustaría saber algo más sobre el proceso de venta?"}],
      //   },
      //   {
      //     role: "user",
      //     parts: [{ text: "Repiteme por favor"}],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "No hay problema, con gusto te repito los pasos para agregar un mensaje adicional a tu plato:\n\n**2.1.-** Primero, **selecciona el plato** al que deseas agregar el mensaje.\n\n**2.2.-** Luego, busca la opción **\"editar mensaje\"** y haz clic en ella. \n\n**2.3.-**  Aparecerá una ventana con opciones de mensajes predefinidos o un espacio para que **escribas tu propio mensaje**. Elige la opción que prefieras.\n\n**2.4.-** Una vez que hayas escrito tu mensaje o elegido una opción, asegúrate de **guardarlo**.\n\n¡Y eso es todo! Tu mensaje adicional se agregará a tu plato.  \n\n¿Hay algo más en lo que te pueda ayudar?"}],
      //   },
      //   {
      //     role: "user",
      //     parts: [{ text: "otra vez"}],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "Disculpa, parece que estoy teniendo problemas para comprenderte. ¿Podrías intentar formular tu pregunta de otra manera? \n\nQuizás podrías decirme:\n\n* **¿Exactamente en qué paso te encuentras atorado?**\n* **¿Qué parte del proceso de agregar un mensaje no te queda clara?**\n\nMientras más detalles me puedas dar, mejor podré ayudarte."}],
      //   },
      //   {
      //     role: "user",
      //     parts: [{ text: "agregar mensaje"}],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "Ah, claro! Agregar un mensaje a tu pedido. Vamos a repasar los pasos una vez más: \n\n**1.-** Asegúrate de que **el plato al que deseas agregar el mensaje ya esté en tu pedido**.\n\n**2.-** **Selecciona el plato** al que quieres añadir el mensaje. \n\n**3.-** Busca la opción **\"editar mensaje\"** y haz clic en ella. \n\n**4.-**  Elige entre las **opciones de mensajes predefinidos** o escribe tu propio mensaje en el espacio provisto.\n\n**5.-** Una vez que hayas terminado, **guarda tu mensaje**.\n\n¡Listo! Tu mensaje se ha agregado al plato seleccionado. \n\n¿Hay algo más que te gustaría saber?"}],
      //   },
      // ],
    });
  
    const result = await chat.sendMessage(text_);
    const response = result.response;
    console.log(response.text());
    return response.text();
};

module.exports = {
    getMessageChatGPT,
    getMessageGemini,
    getMessageGeminiInstance_
};