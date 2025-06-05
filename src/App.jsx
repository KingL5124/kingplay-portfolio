import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaGamepad, FaBook, FaUserAlt, FaCode, FaEnvelope, FaPaintBrush, FaTwitch, 
         FaChevronLeft, FaChevronRight, FaBookOpen, FaComments, FaInstagram, FaYoutube,
         FaPhone, FaMapMarkerAlt, FaTimes, FaTools, FaCalendar } from 'react-icons/fa';
import SpaceGame from './components/SpaceGame';
import portadaNovela from './assets/images/novela/portada.png';
import portadaLibro from './assets/images/book/Portada_Libro.png';
import tarjeta1 from './assets/images/portfolio/tarjeta/Tarjeta 01.png';
import tarjeta2 from './assets/images/portfolio/tarjeta/Tarjeta 02.png';
import escenario1 from './assets/images/portfolio/escenario/Escenario 01.jpg';
import personaje1 from './assets/images/portfolio/personaje/Personaje 01.png';
import logo1 from './assets/images/portfolio/logotipos/Logo1.png';
import logo2 from './assets/images/portfolio/logotipos/Logo2.png';
import logo3 from './assets/images/portfolio/logotipos/Logo3.png';
import logo4 from './assets/images/portfolio/logotipos/Logo4.png';
import portada1 from './assets/images/portfolio/portada/Portada.png';
import retrato1 from './assets/images/portfolio/retratos/retrato1.jpg';
import retrato2 from './assets/images/portfolio/retratos/retrato2.png';
import paisaje1 from './assets/images/portfolio/paisaje/Paisaje 01.png';
import tropipanLogotipo from './assets/images/portfolio/producto/Tropipan_logotipo.png';
import productoPDF from './assets/images/portfolio/producto/Producto 01.pdf';
import profilePhoto from './assets/images/profile/profile-photo.png';
import nuevaImagen1 from './assets/images/novela/nueva-imagen1.png';
import nuevaImagen2 from './assets/images/novela/nueva-imagen2.png';
import nuevaImagen3 from './assets/images/novela/nueva-imagen3.png';
import nuevaImagen4 from './assets/images/novela/nueva-imagen4.png';
import nuevaImagen5 from './assets/images/novela/nueva-imagen5.png';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isReading, setIsReading] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showComments, setShowComments] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNovelaModalOpen, setIsNovelaModalOpen] = useState(false);
  const [selectedNovelaImage, setSelectedNovelaImage] = useState(null);

  // Form validation
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (value.length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = 'Ingrese un email válido';
        }
        break;
      case 'subject':
        if (value.length < 4) {
          error = 'El asunto debe tener al menos 4 caracteres';
        }
        break;
      case 'message':
        if (value.length < 10) {
          error = 'El mensaje debe tener al menos 10 caracteres';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    
    setFormErrors(errors);
    
    // If no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'tarjeta', name: 'Mi Tarjeta' },
    { id: 'escenario', name: 'Escenario en 2D' },
    { id: 'personaje', name: 'Diseño de Personaje' },
    { id: 'logotipos', name: 'Logotipos' },
    { id: 'portada', name: 'Diseño de Portada' },
    { id: 'retratos', name: 'Retratos Simples' },
    { id: 'paisaje', name: 'Paisaje en 2D' },
    { id: 'producto', name: 'Diseño de Producto' },
  ];

  const projects = [
    // Tarjetas
    {
      id: 'tarjeta-1',
      title: 'Mi Tarjeta de Presentación 1',
      category: 'tarjeta',
      image: tarjeta1,
      description: 'Diseño de tarjeta de presentación personal',
      details: {
        fecha: '2025',
        herramientas: ['Photoshop', 'Illustrator'],
        descripcionLarga: 'Una descripción más detallada del proyecto...'
      }
    },
    {
      id: 'tarjeta-2',
      title: 'Mi Tarjeta de Presentación 2',
      category: 'tarjeta',
      image: tarjeta2,
      description: 'Diseño alternativo de tarjeta de presentación',
      details: {
        fecha: '2025',
        herramientas: ['Photoshop', 'Illustrator'],
        descripcionLarga: 'Una descripción más detallada del proyecto...'
      }
    },
    // Escenarios
    {
      id: 'escenario-1',
      title: 'Escenario Semi-Realista',
      category: 'escenario',
      image: escenario1,
      description: 'Escenario 2D con iluminación semi-realista',
      details: {
        fecha: '2023',
        herramientas: ['Illustrator', 'Photoshop'],
        descripcionLarga: 'Diseño de escenario simple con un enfoque en la iluminación semi-realista, combinando técnicas de ilustración vectorial y edición digital.'
      }
    },
    // Personajes
    {
      id: 'personaje-1',
      title: 'Personaje Estilo Blue Lock',
      category: 'personaje',
      image: personaje1,
      description: 'Diseño de personaje inspirado en Blue Lock',
      details: {
        fecha: '2023',
        herramientas: ['Illustrator', 'Photoshop'],
        descripcionLarga: 'Diseño de personaje inspirado en el estilo visual del anime/manga Blue Lock, adaptando sus características distintivas y estética única.'
      }
    },
    // Logotipos
    {
      id: 'logo-1',
      title: 'Logo Canal Gaming',
      category: 'logotipos',
      image: logo1,
      description: 'Diseño de logo para canal de gaming',
      details: {
        fecha: '2022',
        herramientas: ['Illustrator', 'Photoshop'],
        descripcionLarga: 'Logotipo diseñado específicamente para un canal de contenido gaming, incorporando elementos visuales que reflejan la temática de videojuegos.'
      }
    },
    {
      id: 'logo-2',
      title: 'Logo Gaming Nuevo',
      category: 'logotipos',
      image: logo2,
      description: 'Segundo diseño para canal gaming',
      details: {
        fecha: '2025',
        herramientas: ['Illustrator', 'Photoshop'],
        descripcionLarga: 'Propuesta alternativa de logotipo para canal de gaming, con un enfoque diferente pero manteniendo la esencia del contenido de videojuegos.'
      }
    },
    {
      id: 'logo-3',
      title: 'Logo Equipo EA',
      category: 'logotipos',
      image: logo3,
      description: 'Diseño de logo para equipo de EA',
      details: {
        fecha: '2025',
        herramientas: ['Illustrator', 'Photoshop'],
        descripcionLarga: 'Logotipo desarrollado para un equipo de EA, combinando elementos que representan la identidad del equipo y la marca EA.'
      }
    },
    // Portada
    {
      id: 'portada-1',
      title: 'Diseño de Portada',
      category: 'portada',
      image: portada1,
      description: 'Diseño de portada para contenido digital',
      details: {
        fecha: '2024',
        herramientas: ['Illustrator', 'Photoshop'],
        descripcionLarga: 'Diseño de portada que combina elementos visuales atractivos y una composición dinámica para captar la atención del espectador, creado con un enfoque en el impacto visual y la comunicación efectiva del contenido.'
      }
    },
    // Retratos
    {
      id: 'retrato-1',
      title: 'Retrato Femenino',
      category: 'retratos',
      image: retrato1,
      description: 'Retrato digital de personaje femenino',
      details: {
        fecha: '2023',
        herramientas: ['Illustrator'],
        descripcionLarga: 'Retrato digital de una chica creado exclusivamente en Illustrator, enfocado en capturar la esencia del personaje con un estilo vectorial.'
      }
    },
    {
      id: 'retrato-2',
      title: 'Retrato Masculino',
      category: 'retratos',
      image: retrato2,
      description: 'Retrato digital de personaje masculino',
      details: {
        fecha: '2023',
        herramientas: ['Illustrator'],
        descripcionLarga: 'Retrato digital de un personaje masculino realizado en Illustrator, demostrando versatilidad en el manejo de retratos vectoriales.'
      }
    },
    // Paisaje
    {
      id: 'paisaje-1',
      title: 'Bosque Fantástico',
      category: 'paisaje',
      image: paisaje1,
      description: 'Ilustración de bosque con elementos fantásticos',
      details: {
        fecha: '2024',
        herramientas: ['Illustrator'],
        descripcionLarga: 'Ilustración de un bosque fantástico creado exclusivamente en Illustrator, combinando elementos naturales con toques mágicos y fantásticos.'
      }
    },
    // Producto
    {
      id: 'producto-1',
      title: 'Diseño de Producto - Fruta Pan',
      category: 'producto',
      image: tropipanLogotipo,
      pdfFile: productoPDF,
      description: 'Diseño de producto para Fruta Pan Isleña',
      details: {
        fecha: '2025',
        herramientas: ['Adobe Illustrator', 'Adobe Photoshop'],
        descripcionLarga: 'Diseño de producto creado por Alexis y King para la Fruta Pan Isleña, utilizando Adobe Illustrator y Photoshop para crear una identidad visual única y atractiva que representa la esencia de este producto tradicional.'
      }
    },
  ];

  const chapters = [
    {
      id: 0,
      title: "Prólogo",
      content: (
        <div className="prose prose-invert mx-auto max-w-[65ch] text-[1.125rem] leading-[1.8] text-[#f2f2f2]">
          <div className="space-y-8">
            <p className="mb-4">Habrá quienes desestimen la idea de que nuestro mundo podría ser destruido por un ser supremo, considerándolo solo una artimaña de conspiradores para mantenernos bajo control. Sin embargo, ¿qué pasaría si les contara que en una realidad alterna el caos, la separación y la avaricia consumieron a sus habitantes? En ese mundo, el fin de los tiempos llegó, y con él, se desató una época oscura de sufrimiento y agonía.</p>

            <p className="mb-4">Lejos de las creencias populares sobre un ser todopoderoso, Dios decidió otorgar una segunda oportunidad a la humanidad. En un apocalipsis que parecía sacado de las páginas de la Biblia, este ser —cuyo nombre se pierde entre los susurros del viento— creó un mundo posible, un lugar nacido únicamente de la ficción. Un reino donde la magia fluye como un río subterráneo y las criaturas se entrelazan en una danza ancestral.</p>

            <p className="mb-4">En este nuevo comienzo, un grupo de humanos se halla en el epicentro de la transformación. Despiertan en un paisaje desconocido, donde cielos de un azul radiante y árboles que murmuran secretos ancestrales conforman la nueva realidad. Aquí, las leyes de la física no siempre se aplican, y la conexión entre especies trasciende la mera coexistencia. Los humanos se ven forzados a enfrentar los desafíos de un mundo completamente distinto al que conocían: criaturas mágicas que desafían la lógica, espacios donde el tiempo se despliega en espirales y emociones que se manifiestan en luces brillantes.</p>

            <p className="mb-4">¿Podrán adaptarse y vivir en este nuevo mundo? ¿Serán capaces de transformar su esencia para sobrevivir en Kinelia? En este universo, las decisiones tienen consecuencias que trascienden lo imaginable, y cada acción reverbera en los hilos del destino.</p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Capítulo 1: Un Nuevo Comienzo / La Humanidad se Abre Paso",
      content: (
        <div className="prose prose-invert mx-auto max-w-[65ch] text-[1.125rem] leading-[1.8] text-[#f2f2f2]">
          <div className="chapter-content prose prose-invert mb-8">
            <div className="max-w-2xl mx-auto text-[1.125rem] leading-relaxed text-[#f2f2f2]">
              {/* Escena 1: El castillo y la mujer */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Castillo en las Nubes</h4>
                <p>A lo lejos, un imponente castillo se alzaba entre las nubes, acercándose lentamente. La escena se enfocó en una de sus habitaciones, sumida en penumbra. Allí, una mujer sostenía un bebé en brazos. Su piel pálida y los pequeños cuernos que adornaban su cabeza apenas eran visibles bajo la tenue luz. El niño, con los ojos entrecerrados, chupaba su dedo con tranquilidad.</p>
                <p className="italic mt-4">"¿Quieres que te cuente una gran historia, hijo?" susurró la mujer con suavidad, acunándolo contra su pecho.</p>
                <p className="italic">"Esta es la historia de *********, y comienza así..."</p>
              </div>

              {/* Escena 2: San Islán */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">San Islán</h4>
                <p>Año 2022. En algún rincón del mar Caribe, emergía San Islán, una pequeña isla tropical saturada de fauna y flora, acariciada por un mar de siete matices. El atardecer detonaba una sinfonía de colores mientras una brisa salina entonaba melodías de serenidad. Para quienes habían renunciado a las cadenas urbanas, este lugar era un auténtico Edén.</p>
                <p className="mt-4">Para Iverson, nuestro protagonista, era más que eso: era su hogar.</p>
              </div>

              {/* Escena 3: Descripción de Iverson */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Protagonista</h4>
                <p>Iverson, un joven de piel bronceada por el sol y en completa armonía con su entorno, poseía una apariencia única. Esbelto y más alto que el promedio, sus ojos marrones irradiaban una alegría contagiosa. Sus largas trenzas eran un distintivo personal, aunque seguía la regla de no dejar crecer el cabello a los lados de su cabeza para sentir la caricia del viento.</p>
              </div>

              {/* Escena 4: La conversación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Conversación</h4>
                <p>Recostado en su cama, se sumía en el mundo de la música, con los auriculares reproduciendo canciones de Morat a todo volumen. Al mismo tiempo, chateaba por Ghost Fase con Sarah, su mejor amiga, sobre los planes del fin de semana.</p>
                <div className="mt-4 space-y-2">
                  <p className="italic">¿Viste las noticias, Iverson?</p>
                  <p className="italic">Sí. Mi madre está bastante preocupada por eso desde ayer. No quiere que salga de casa.</p>
                  <p className="italic">Impresionante, ¿verdad? Un hombre aniquiló a toda su familia...</p>
                  <p className="italic">Me parece absurdo. Eso y lo del monje del Amazonas soñando con el fin del mundo son tonterías.</p>
                </div>
              </div>

              {/* Escena 5: El terremoto */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Terremoto</h4>
                <p>De pronto, el suelo bajo sus pies comenzó a temblar. La expresión de Iverson se ensombreció mientras retiraba los auriculares. Un extraño sonido de trompetas resonaba a lo lejos: era hermoso y perturbador al mismo tiempo, generándole un escalofrío incontrolable.</p>
                <p className="mt-4">¡Mierda! Necesito averiguar qué está pasando.</p>
              </div>

              {/* Escena 6: La alerta */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Alerta</h4>
                <p>Se levantó rápidamente, pero antes de que pudiera moverse, la televisión se encendió sola, mostrando un mensaje en letras grandes y rojas:</p>
                <p className="text-red-500 font-bold mt-4">"ALERTA: ESTO NO ES UN SIMULACRO".</p>
                <p className="mt-4">El mensaje desapareció, y en su lugar apareció una periodista con el rostro desencajado por el terror.</p>
                <p className="mt-4">Se recomienda a todos los habitantes buscar refugio de inmediato. Una ola de temblores masivos, granizo, fuego y sangre se está extendiendo. No sabemos por qué, pero...</p>
                <p className="mt-4">La transmisión se cortó abruptamente.</p>
              </div>

              {/* Escena 7: La madre */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Llamada de la Madre</h4>
                <p>En ese instante, alguien golpeó frenéticamente la puerta de su habitación.</p>
                <p className="mt-4">¡Hijo! ¡Abre la puerta! ¡Mira lo que están diciendo en las noticias! ¡Tenemos que rezar para que Dios nos perdone!</p>
                <p className="mt-4">Iverson, aun procesando lo que ocurría, respondió con voz temblorosa:</p>
                <p className="mt-4">¡Sí, madre! ¡Lo vi! ¡Tenías razón!</p>
                <p className="mt-4">Cuando intentó abrir la puerta, un mareo lo invadió, y cayó inconsciente al suelo.</p>
              </div>

              {/* Escena 8: El caos */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Caos</h4>
                <p>El caos reinaba en las calles. Gritos, llantos y el ruido de objetos cayendo se mezclaban con las plegarias de los desesperados. Predicadores religiosos clamaban salvación, mientras los ateos, en un acto de contradicción, suplicaban a un Dios en el que nunca creyeron.</p>
                <p className="mt-4">Cadáveres emergían de sus tumbas, y los lamentos de los vivos resonaban en cada rincón del planeta.</p>
              </div>

              {/* Escena 9: El silencio */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Silencio</h4>
                <p>Entonces, todo quedó en silencio.</p>
                <p className="mt-4">Era un silencio absoluto, tan profundo que hasta el aleteo de una mariposa habría sido un estruendo.</p>
              </div>

              {/* Escena 10: La aparición */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Aparición</h4>
                <p>El cielo comenzó a abrirse en dos, como si un velo invisible fuera rasgado. Torrentes de nubes densas se separaron, dejando paso a una luz cegadora. De esa radiante luminosidad emergieron siete figuras majestuosas: los arcángeles Miguel, Gabriel, Rafael, Uriel, Jegudiel, Sealtiel y Barachiel.</p>
                <p className="mt-4">Cada uno portaba cuatro alas fulgurantes que disipaban la sombra, y su canto celestial llenó el aire con una belleza sobrecogedora.</p>
              </div>

              {/* Escena 11: Dios */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Presencia Divina</h4>
                <p>Detrás de ellos apareció un ser aún más imponente: DIOS.</p>
                <p className="mt-4">Vestido con una túnica blanca y una corona de cristal, su rostro estaba oculto por una cascada de luz que solo dejaba entrever una magnífica barba blanca, como la primera nevada del invierno.</p>
                <p className="mt-4">Los arcángeles se alinearon en perfecta formación, esperando las palabras del Señor.</p>
              </div>

              {/* Escena 12: El mensaje */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Mensaje</h4>
                <p className="italic">Hijos míos, sé que la intranquilidad les agobia, pero les pido calma y atención —dijo Dios con una voz profunda que llenó los corazones de paz.</p>
                <p className="mt-4">Siete trompetas resonaron al unísono mientras Él continuaba:</p>
                <p className="mt-4 italic">He descendido hasta aquí para castigarles por sus errores y poner fin al sufrimiento de este planeta que les he entregado.</p>
                <p className="mt-4">Los arcángeles comenzaron a ondear bastones dorados, moviéndose con una coordinación hipnótica, mientras nuevos sonidos de trompetas llenaban el aire.</p>
              </div>

              {/* Escena 13: El juicio */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Juicio</h4>
                <p className="italic">Desde que dejaron el paraíso, han sido una plaga para la Tierra. Les envié a mi hijo para morir por sus pecados y les di un manual para vivir en comunión conmigo, pero muchos me han despreciado.</p>
                <p className="mt-4 italic">Tomaron mi imagen y la del cielo para erigir iglesias majestuosas, pero olvidaron el espíritu de mi palabra.</p>
                <p className="mt-4 italic">Violencia, asesinatos, discriminación, avaricia... Todo esto he perdonado, pero al blasfemar contra el Espíritu Santo, me han demostrado que son mi peor creación.</p>
                <p className="mt-4">El suelo se resquebrajó y los truenos estallaron con fuerza.</p>
              </div>

              {/* Escena 14: La oportunidad */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Segunda Oportunidad</h4>
                <p className="italic">No obstante, admito mi culpa por otorgarles libre albedrío y no corregirles a tiempo. Por eso, estoy aquí, como ustedes profetizaron en el fin de los tiempos.</p>
                <p className="mt-4">Las palabras de Dios parecieron detener el tiempo. Con un movimiento solemne, extendió sus manos hacia la humanidad.</p>
                <p className="mt-4 italic">Les doy una segunda oportunidad. Los enviaré a un mundo fantástico, lleno de maravillas y criaturas que jamás imaginaron. Allí, podrán cambiar... o perecer.</p>
              </div>

              {/* Escena 15: El final */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Final</h4>
                <p>Con esas palabras, los arcángeles y Dios comenzaron a ascender hacia el cielo. La tecnología falló y las nubes sumieron todo en oscuridad.</p>
                <p className="mt-4">Las últimas palabras resonaron en medio del caos:</p>
                <p className="mt-4 italic">Hijos míos, no me decepcionen de nuevo<span className="retro-cursor"></span></p>
                <p className="mt-4">Y el mundo, tal como lo conocían, se desvaneció.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Capítulo 2: Un Mundo Nuevo que Descubrir",
      content: (
        <div className="prose prose-invert mx-auto max-w-[65ch] text-[1.125rem] leading-[1.8] text-[#f2f2f2]">
          <div className="chapter-content prose prose-invert mb-8">
            <div className="max-w-2xl mx-auto text-[1.125rem] leading-relaxed text-[#f2f2f2]">
              {/* Escena 1: El Despertar */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Despertar</h4>
                <p>"¡Ahhh, maldita sea! ¿Dónde estoy?"</p>
                <p className="mt-4">Iverson abrió los ojos con lentitud. A su alrededor, todo era un blanco absoluto, tan intenso que parecía borrar cualquier noción de espacio o tiempo.</p>
                <p className="mt-4 italic">"¿Por qué todo está tan vacío? Esto necesita algo de Negro... Espera... ¡No! No me digas que estoy... ¿muerto?"</p>
                <p className="mt-4">Su voz temblaba entre incredulidad y miedo, mientras su mente intentaba procesar lo que veía.</p>
              </div>

              {/* Escena 2: El Encuentro */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Encuentro</h4>
                <p>Una tos ligera lo sacó de sus pensamientos.</p>
                <p className="italic mt-4">"Ejem, aquí arriba"</p>
                <p className="mt-4">Iverson levantó la vista y vio a un hombre sentado en un trono imponente hecho de cristal reluciente. Su presencia era deslumbrante, casi irreal.</p>
                <p className="mt-4">Retrocedió unos pasos, maravillado y algo intimidado. La figura frente a él parecía enorme, casi desproporcionada, como si su simple existencia hiciera más pequeño al joven.</p>
              </div>

              {/* Escena 3: La Revelación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Revelación</h4>
                <p className="italic">"Hijo mío, sé que tienes muchas preguntas. No puedo responderlas todas, pero hay algo que debes saber: has sido elegido entre los humanos para recibir habilidades únicas"</p>
                <p className="mt-4">Iverson, sin dejar de observarlo, preguntó con un hilo de voz:</p>
                <p className="italic mt-4">"¿Y qué pasó con mis padres y mis amigos? ¿Con las personas que amo?"</p>
              </div>

              {/* Escena 4: La Duda de Gabriel */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Duda de Gabriel</h4>
                <p>Desde las sombras, apareció otro ser imponente: Gabriel, un arcángel que lo observaba con cierta duda.</p>
                <p className="italic mt-4">"¿Está seguro de que él es el indicado, Señor?"</p>
                <p className="italic mt-4">"Todo está bajo control"</p>
                <p className="mt-4">Pero Gabriel insistió, mirando a Iverson con desdén:</p>
                <p className="italic mt-4">"Señor, apenas puede mantenerse en pie. Está débil. No creo que soporte lo que viene".</p>
                <p className="mt-4">Molesto, Iverson alzó la voz:</p>
                <p className="italic mt-4">"¡Hey, oye! ¡No es mi culpa! Ni siquiera sé cómo terminé aquí".</p>
              </div>

              {/* Escena 5: La Promesa */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Promesa</h4>
                <p>El Señor lo tranquilizó con un gesto.</p>
                <p className="italic mt-4">"No prestes atención a Gabriel. Aquellos que amas están bien y, de hecho, una de tus amigas también ha recibido habilidades especiales".</p>
                <p className="mt-4">Hizo una pausa antes de añadir con solemnidad:</p>
                <p className="italic mt-4">"Yo tu padre confió en ti para ser un pilar de la nueva humanidad".</p>
                <p className="mt-4">Con un toque suave en su cabeza, Iverson sintió cómo su consciencia se desvanecía. Las últimas palabras que escuchó fueron:</p>
                <p className="italic mt-4">"Te observaré".</p>
              </div>

              {/* Escena 6: El Bosque Mágico */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Bosque Mágico</h4>
                <p>Cuando abrió los ojos, se encontró en un bosque. Pero este no era un bosque cualquiera; cada rincón parecía estar impregnado de magia. La humedad en el aire era palpable, y los altos árboles bloqueaban la luz del sol, creando un entorno místico y ligeramente opresivo.</p>
                <p className="mt-4">A lo lejos, distinguió a tres jóvenes conversando en voz baja.</p>
                <p className="italic mt-4">"¿Vieron lo que tiene? ¿Y si lo robamos?"</p>
                <p className="italic mt-4">"Mejor lo matamos y luego nos llevamos todo"</p>
                <p className="italic mt-4">"¿No fue por este tipo de cosas que nos trajeron aquí en primer lugar?"</p>
              </div>

              {/* Escena 7: El Descubrimiento */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Descubrimiento</h4>
                <p>Iverson, todavía tumbado en el suelo, se quedó helado.</p>
                <p className="italic mt-4">"¿Qué demonios están tramando? ¿Por qué quieren matarme?"</p>
                <p className="mt-4">Uno de los chicos señaló en su dirección.</p>
                <p className="italic mt-4">"¡Oigan, ya despertó!"</p>
                <p className="mt-4">Fue entonces cuando notó algo extraño en su espalda. Al palparse, descubrió un arco y, bajo él, una funda con dos espadas cortas. También llevaba un carcaj lleno de flechas y un par de brazaletes de aspecto extraño en las muñecas.</p>
              </div>

              {/* Escena 8: La Confrontación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Confrontación</h4>
                <p>Aunque no sabía cómo usar esas armas, supo que podrían ser su única salvación.</p>
                <p className="mt-4">Con una mezcla de determinación y nerviosismo, tomó el arco y apuntó hacia los desconocidos.</p>
                <p className="italic mt-4">"No se acerquen"</p>
                <p className="mt-4">Sus manos temblaban, y el peso de su arco le recordaba su inexperiencia.</p>
              </div>

              {/* Escena 9: El Salvador Misterioso */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Salvador Misterioso</h4>
                <p>De repente, una voz surgió detrás de él, tranquila pero cargada de autoridad.</p>
                <p className="italic mt-4">"¿De verdad? ¿Aún después de todo lo que pasó siguen con estas idioteces?"</p>
                <p className="mt-4">Iverson giró lentamente la cabeza. De entre las sombras apareció un joven alto y delgado, con un cabello oscuro que se asemejaba a algas ondulantes. Su rostro reflejaba seriedad, y sus ojos destilaban un aire de peligro.</p>
              </div>

              {/* Escena 10: La Amenaza */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Amenaza</h4>
                <p>El recién llegado caminó hacia él, colocó una mano sobre su hombro y luego se dirigió a los otros chicos:</p>
                <p className="italic mt-4">"Él tiene armas, ustedes no. Y, por si fuera poco, yo estoy con él. ¿Realmente creen que tienen alguna oportunidad?"</p>
                <p className="mt-4">En ese momento, el aire se tornó pesado, casi opresivo. Detrás del joven apareció una gigantesca serpiente de sombra que se alzaba amenazante.</p>
                <p className="mt-4">Los tres chicos, aterrados, salieron corriendo sin mirar atrás.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Capítulo 3: Nuevas Adversidades se Aproximan",
      content: (
        <div className="prose prose-invert mx-auto max-w-[65ch] text-[1.125rem] leading-[1.8] text-[#f2f2f2]">
          <div className="chapter-content prose prose-invert mb-8">
            <div className="max-w-2xl mx-auto text-[1.125rem] leading-relaxed text-[#f2f2f2]">
              {/* Escena 1: El Encuentro */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Encuentro</h4>
                <p className="italic">"¡Eso es, corran!"</p>
                <p className="mt-4">Reco se dio la vuelta para mirar a Iverson con una sonrisa.</p>
                <p className="mt-4">Iverson lo observó con curiosidad y algo de desconfianza.</p>
                <p className="italic mt-4">"Gracias por echarme una mano, pero... ¿Quién eres y por qué me salvaste?"</p>
                <p className="mt-4">Reco se encogió de hombros con aire despreocupado.</p>
                <p className="italic mt-4">"Es simple, lo hice por supervivencia. ¿No dicen que dos cabezas piensan mejor que una? Además, no valía la pena usar tus armas contra esos idiotas".</p>
              </div>

              {/* Escena 2: La Presentación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Presentación</h4>
                <p>Una sonrisa confiada se dibujó en el rostro de Reco mientras extendía su mano hacia Iverson.</p>
                <p className="mt-4">Iverson, aunque algo nervioso por la respuesta del extraño, retrocedió un poco. ¿Quién defendería a un desconocido con tanta seguridad, estando seguro de que no lo traicionarían después?</p>
                <p className="mt-4">A pesar de sus dudas, decidió mostrarse amistoso. Después de todo, Reco le había salvado la vida.</p>
                <p className="italic mt-4">"Mi nombre es Iverson, tengo 17 años y... gracias por salvarme".</p>
                <p className="mt-4">Le estrechó la mano con una sonrisa tímida.</p>
                <p className="italic mt-4">"Mucho gusto, soy Reco, tengo 18..."</p>
              </div>

              {/* Escena 3: El Grito */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Grito</h4>
                <p>Antes de que pudiera continuar, un grito desgarrador resonó en el aire. Era una voz pidiendo ayuda desesperadamente.</p>
                <p className="mt-4">Sin pensarlo dos veces, Iverson comenzó a correr hacia el origen del sonido.</p>
                <p className="italic mt-4">"¡Espera!"</p>
                <p className="mt-4">Reco gritó, corriendo tras él.</p>
                <p className="italic mt-4">"¿Por qué corres hacia el ruido? ¿Sabes que son los mismos que intentaron robarte, verdad?"</p>
              </div>

              {/* Escena 4: La Persecución */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Persecución</h4>
                <p>Reco trataba de razonar con él mientras lo seguía de cerca.</p>
                <p className="italic mt-4">"Si están gritando así, significa que algo más fuerte los atacó. No es seguro acercarse".</p>
                <p className="mt-4">Pero Iverson parecía ignorar sus palabras. Su cuerpo temblaba con cada paso, como si una parte de él supiera que debía detenerse, pero algo más lo impulsara a seguir adelante.</p>
              </div>

              {/* Escena 5: La Decisión */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Decisión</h4>
                <p>Reco logró alcanzarlo y, al mirarlo de cerca, notó algo diferente en su expresión. Ya no era el mismo chico asustado que había salvado momentos atrás. Iverson estaba decidido.</p>
                <p className="italic mt-4">"Vaya, vaya..." pensó Reco, esbozando una sonrisa. "¿Quién lo diría? Este chico tiene agallas".</p>
              </div>

              {/* Escena 6: La Masacre */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Masacre</h4>
                <p>Tras varios minutos, ambos llegaron al lugar del que provenían los gritos. Iverson se detuvo en seco, paralizado por la escena frente a él.</p>
                <p className="mt-4">Tres cuerpos brutalmente despedazados yacían en el suelo. Había sangre por todas partes, impregnando el aire con un hedor insoportable.</p>
                <p className="italic mt-4">"¡Mierda!"</p>
                <p className="mt-4">Iverson exclamó, incapaz de apartar la vista de aquel espectáculo macabro.</p>
              </div>

              {/* Escena 7: La Advertencia */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Advertencia</h4>
                <p>Reco se detuvo a su lado, observando la escena con frialdad.</p>
                <p className="italic mt-4">"Joder... tendrás que acostumbrarte", dijo con voz seria. "Esto no es nada comparado con lo que nos espera".</p>
              </div>

              {/* Escena 8: El Ataque */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Ataque</h4>
                <p>Antes de que Iverson pudiera reaccionar, Reco sacó su ballesta y disparó hacia un arbusto detrás de ellos. Una flecha pasó rozando a Iverson y se clavó en el arbusto, de donde empezó a fluir un líquido verde espeso.</p>
                <p className="italic mt-4">"Lo sabía..." murmuró Reco mientras recargaba su ballesta. "Tú fuiste quien insistió en venir aquí sin importar los peligros. Ahora tendrás que enfrentarlos. Si no te mata esa cosa, lo haré yo".</p>
              </div>

              {/* Escena 9: El Miedo */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Miedo</h4>
                <p>Iverson apretó los dientes y los puños, luchando contra el miedo que lo paralizaba.</p>
                <p className="italic mt-4">"¡Lo sé, lo sé!" pensó desesperadamente.</p>
                <p className="mt-4">De las sombras emergió una criatura pequeña, de menos de un metro de altura, con piel verde, orejas puntiagudas y un cuchillo de piedra en la mano. Sus ojos brillaban con intenciones asesinas.</p>
              </div>

              {/* Escena 10: La Confrontación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Confrontación</h4>
                <p>Iverson quedó inmóvil, incapaz de reaccionar mientras la criatura se acercaba.</p>
                <p className="mt-4">Antes de que pudiera atacarlo, Reco disparó una segunda flecha, impactando directamente en el entrecejo de la criatura.</p>
                <p className="mt-4">Reco se acercó rápidamente y jaló a Iverson por la camisa.</p>
                <p className="italic mt-4">"¡Reacciona! ¿Acaso quieres morir?"</p>
              </div>

              {/* Escena 11: La Furia */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Furia</h4>
                <p>La furia en su voz era evidente.</p>
                <p className="italic mt-4">"Tú decidiste venir aquí sabiendo que había peligros. ¿Dónde está el chico que, aunque su cuerpo le pedía detenerse, seguía corriendo? ¿Dónde está?"</p>
                <p className="mt-4">Reco lo soltó bruscamente y continuó hablando con un tono más severo.</p>
                <p className="italic mt-4">"¿No tienes ni idea de lo que pasó con tu familia? ¿No quieres saber dónde están las personas que amas?"</p>
              </div>

              {/* Escena 12: El Enfrentamiento Final */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Enfrentamiento Final</h4>
                <p>Las palabras de Reco apenas tuvieron tiempo de asentarse cuando, de las sombras, comenzaron a surgir más criaturas verdosas. Todas portaban armas rudimentarias como garrotes y cuchillos de piedra.</p>
                <p className="mt-4">Ambos chicos se colocaron espalda contra espalda, rodeados por los enemigos.</p>
                <p className="italic mt-4">"Por mi culpa estamos en esta situación", pensó Iverson, sintiendo el peso de la culpa.</p>
                <p className="mt-4">Las palabras de Reco resonaban en su mente, pero algo más comenzaba a surgir en su interior. Sus ojos adquirieron un intenso color rojo carmesí y su pupila se volvió tan delgada como la de un reptil, mientras una renovada determinación se apoderaba de él.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Capítulo 4: Un Nuevo Elegido por Dios Presente?",
      content: (
        <div className="prose prose-invert mx-auto max-w-[65ch] text-[1.125rem] leading-[1.8] text-[#f2f2f2]">
          <div className="chapter-content prose prose-invert mb-8">
            <div className="max-w-2xl mx-auto text-[1.125rem] leading-relaxed text-[#f2f2f2]">
              {/* Escena 1: El Cambio */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Cambio</h4>
                <p>En el instante en que los iris de sus ojos cambiaron, el tiempo pareció detenerse. Las criaturas de la horda se movían como si estuvieran a cámara lenta, y cada detalle era visible para él con una claridad casi irreal. Sin detenerse a cuestionar lo que ocurría, tomó su arco y comenzó a moverse con agilidad, protegiendo la retaguardia de Reco mientras observaba cada movimiento enemigo.</p>
                <p className="mt-4">Sin embargo, aunque sus ojos le permitían ver la ubicación exacta de cada criatura, su puntería dejaba mucho que desear. Las flechas de Iverson pasaban rozando a las criaturas o se perdían entre los árboles, pero eso creaba el caos suficiente para que Reco aprovechara su ventaja. Con su ballesta, disparaba certeramente y derribaba a las criaturas que habían esquivado las flechas de Iverson.</p>
              </div>

              {/* Escena 2: La Estrategia */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Estrategia</h4>
                <p className="italic">"Joder, nos atraparon como cerdos en el matadero..."</p>
                <p className="mt-4">Reco murmuró, su rostro tensado por la situación.</p>
                <p className="mt-4">Volvió a cargar su ballesta mientras evaluaba sus opciones.</p>
                <p className="italic mt-4">"Voy a tratar de crear una distracción. A menos que quieras morir, sígueme".</p>
              </div>

              {/* Escena 3: El Incidente */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Incidente</h4>
                <p>De repente, una flecha enemiga rozó la mejilla de Reco, dejándole un corte superficial. Un zumbido agudo invadió sus oídos y, por un instante, el tiempo pareció detenerse para él. Su mente se llenó de pensamientos caóticos, pero rápidamente volvió en sí.</p>
                <p className="mt-4">Iverson lo miró de reojo, desconcertado al notar el extraño trance de Reco. Pero justo en ese momento, Reco reaccionó lanzando una flecha que pasó peligrosamente cerca de Iverson.</p>
                <p className="italic mt-4">"¡Fíjate dónde apuntas!"</p>
                <p className="mt-4">Iverson exclamó, aún más sorprendido.</p>
              </div>

              {/* Escena 4: La Revelación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Revelación</h4>
                <p className="italic">"Lo hice a propósito, idiota"</p>
                <p className="mt-4">Reco respondió con una mueca.</p>
                <p className="mt-4">Solo entonces Iverson notó el cuerpo de una criatura detrás de él, abatida por el disparo de Reco.</p>
                <p className="mt-4">Reco suspiró, recargando su ballesta.</p>
                <p className="italic mt-4">"Vámonos, Iverson. No podemos perder más tiempo aquí".</p>
              </div>

              {/* Escena 5: La Huida */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Huida</h4>
                <p>Sin decir una palabra, ambos comenzaron a correr hacia lo profundo del bosque. Las criaturas los seguían a la distancia, aunque los árboles y arbustos dificultaban su avance. Iverson, sin embargo, no podía dejar de pensar en lo que había presenciado momentos atrás.</p>
                <p className="italic mt-4">"¿Quién rayos es él?"</p>
                <p className="mt-4">Se preguntaba mientras trataba de mantener el ritmo.</p>
              </div>

              {/* Escena 6: El Refugio */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Refugio</h4>
                <p>Tras varios minutos de carrera, el cansancio empezó a hacer mella en ambos. Sin la adrenalina que antes los impulsaba, sus piernas se sentían pesadas y su respiración era cada vez más laboriosa. Entonces, divisaron una cueva entre los árboles y, sin dudarlo, se dirigieron hacia ella.</p>
                <p className="mt-4">Reco, al llegar, se detuvo un momento, observando con cautela la entrada oscura. Pero Iverson, sin vacilar, se adentró.</p>
              </div>

              {/* Escena 7: La Exploración */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Exploración</h4>
                <p className="italic">"Joder, no puedo ver nada"</p>
                <p className="mt-4">Iverson murmuró mientras intentaba ajustar sus ojos a la penumbra.</p>
                <p className="italic mt-4">"Creo que esto servirá"</p>
                <p className="mt-4">Reco respondió, sacando una linterna de su mochila.</p>
                <p className="mt-4">El tenue brillo de la linterna iluminó parcialmente el interior de la cueva. Era un espacio amplio y húmedo, con estalactitas goteando agua que resonaba débilmente en el silencio.</p>
              </div>

              {/* Escena 8: El Descubrimiento */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Descubrimiento</h4>
                <p>Mientras avanzaban, Iverson notó algo extraño al fondo.</p>
                <p className="italic mt-4">"Reco, apunta la linterna hacia allí. Hay algo extraño".</p>
                <p className="mt-4">Reco dirigió el haz de luz hacia donde Iverson señalaba, revelando un enorme huevo que descansaba sobre el suelo rocoso. El huevo, de medio metro de altura, tenía una textura rugosa y patrones en zigzag de color rojo que parecían brillar bajo la luz.</p>
              </div>

              {/* Escena 9: La Fascinación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Fascinación</h4>
                <p>Iverson se acercó lentamente, fascinado por el objeto.</p>
                <p className="italic mt-4">"Espera, ¿qué estás haciendo?"</p>
                <p className="mt-4">Le advirtió Reco, con el ceño fruncido.</p>
                <p className="italic mt-4">"No sabemos a qué criatura puede pertenecer esto. Por el tamaño del huevo, lo que sea que salga de ahí no será pequeño. Tenemos que irnos ya".</p>
              </div>

              {/* Escena 10: El Peligro */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Peligro</h4>
                <p>Pero Iverson no escuchaba. Cada paso que daba hacia el huevo parecía hipnotizarlo más. Justo cuando extendió la mano para tocarlo, un rugido ensordecedor sacudió la cueva, haciendo que las paredes vibraran y el suelo temblara bajo sus pies.</p>
                <p className="mt-4">Reco dio un salto hacia atrás, dejando caer la linterna mientras buscaba desesperadamente un escondite.</p>
                <p className="italic mt-4">"¿Qué demonios fue eso?"</p>
                <p className="mt-4">Murmuró, con un escalofrío recorriéndole la espalda.</p>
              </div>

              {/* Escena 11: El Misterio */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Misterio</h4>
                <p>Incluso él, que había enfrentado múltiples peligros, no pudo evitar sentirse intimidado por la presencia que llenaba la cueva.</p>
                <p className="italic mt-4">"Joder... ¿Qué le habrá pasado a Iverson?"</p>
                <p className="mt-4">La linterna, caída en el suelo, proyectaba un tenue haz de luz que apenas iluminaba una parte de la cueva.</p>
              </div>

              {/* Escena 12: La Amenaza */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Amenaza</h4>
                <p>De repente, una enorme pata escamosa apareció en el campo de visión. Era una pierna masiva, coronada por garras afiladas que parecían capaces de desgarrar cualquier cosa.</p>
                <p className="mt-4">La criatura aplastó la linterna con un movimiento brusco, sumiendo la cueva en una oscuridad total.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Capítulo 5: ¿Esa Criatura es lo que Creo?",
      content: (
        <div className="prose prose-invert mx-auto max-w-[65ch] text-[1.125rem] leading-[1.8] text-[#f2f2f2]">
          <div className="chapter-content prose prose-invert mb-8">
            <div className="max-w-2xl mx-auto text-[1.125rem] leading-relaxed text-[#f2f2f2]">
              {/* Escena 1: La Aproximación */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Aproximación</h4>
                <p>Los pasos de aquella bestia resonaban con fuerza en toda la cueva. A cada avance, el suelo temblaba, y un eco profundo reverberaba en las paredes. La criatura se aproximaba lentamente hacia Iverson, como si lo estuviera analizando, cautelosa.</p>
                <p className="mt-4">El joven, abrazando el huevo con ambas manos, sintió cómo sus pies temblaban. Su respiración era errática, pero algo en su interior le decía que no lo soltara. Aunque la oscuridad llenaba la cueva, Iverson pudo distinguir una sombra inmensa, de apariencia reptiliana, que se movía hacia él. De repente, unos ojos brillantes llamaron su atención. Eran de un rojo escarlata deslumbrante, perforando la penumbra.</p>
              </div>

              {/* Escena 2: El Encuentro */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Encuentro</h4>
                <p>Iverson quedó paralizado, sus ojos clavados en aquella mirada hipnotizante. Poco a poco, el iris de la bestia cambió de un rojo candente a un amarillo brillante, emitiendo un destello que iluminó momentáneamente su alrededor.</p>
                <p className="italic mt-4">"¿Qué debo hacer? ¿Por qué se acerca a mí? Me sudan las manos, pero no puedo dejar que lastime a esta criatura... aún no ha tenido la oportunidad de vivir"</p>
                <p className="mt-4">Iverson pensó, intentando calmar el pánico que lo consumía.</p>
              </div>

              {/* Escena 3: El Ataque */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Ataque</h4>
                <p>La criatura se encontraba a escasos metros, y su actitud cambió. Apretó su mandíbula y abrió la boca lentamente. Iverson notó cómo el cuello de la bestia comenzaba a brillar intensamente, justo antes de que una llamarada abrasadora saliera disparada hacia él.</p>
                <p className="mt-4">Sin tiempo para reaccionar, Iverson se cubrió instintivamente con el huevo, cerrando los ojos con fuerza.</p>
              </div>

              {/* Escena 4: La Transformación */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Transformación</h4>
                <p>Cuando los abrió, sus pupilas ya se habían transformado: el iris adquirió un intenso rojo carmesí, y su pupila se volvió fina como la de un reptil. Ahora, sus ojos podían ver con un poco más de claridad. Verificó que el huevo estuviera intacto y se puso delante de él, encarando a la bestia con una mirada desafiante.</p>
                <p className="mt-4">La criatura, al observar los ojos de Iverson, se detuvo. Su expresión feroz se suavizó, y en lugar de atacar, se acercó lentamente, curiosa. Bajó su hocico hasta la frente de Iverson, como si quisiera olerlo.</p>
              </div>

              {/* Escena 5: La Paz */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Paz</h4>
                <p>Iverson permaneció inmóvil, sintiendo cómo una extraña paz lo invadía. Entonces, un destello blanco inundó la cueva, cegando todo por un instante.</p>
                <p className="mt-4">Reco, que había estado escondido, se cubrió los ojos con el brazo.</p>
                <p className="italic mt-4">"Wow... no lo puedo creer. ¿Esa criatura es un d...?"</p>
              </div>

              {/* Escena 6: La Visión */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Visión</h4>
                <p>La mente de Iverson comenzó a nublarse, como si estuviera siendo transportado a otro lugar. Poco a poco, todo se aclaró, y se encontró en un vasto cielo azul.</p>
                <p className="italic mt-4">"Ahh... ¿qué es esto? ¿Estoy... volando?"</p>
                <p className="mt-4">Bajó la mirada y vio un inmenso mar de azul profundo que brillaba bajo el sol. La brisa golpeaba su rostro, y en el horizonte, montañas densamente cubiertas de árboles se alzaban majestuosas.</p>
              </div>

              {/* Escena 7: La Civilización */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Civilización</h4>
                <p>Más abajo, un extenso bosque se extendía hasta donde alcanzaba la vista, y entre las copas de los árboles, divisó una civilización antigua.</p>
                <p className="mt-4">Las casas, construidas con materiales naturales, se integraban perfectamente en el paisaje. Sin embargo, la tranquilidad del panorama se rompió de golpe. Grandes bolas de fuego comenzaron a llover desde el cielo, acompañadas de rayos eléctricos, gritos de pánico y furia.</p>
              </div>

              {/* Escena 8: La Ira */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Ira</h4>
                <p>Iverson sintió cómo su cuerpo cambiaba, deformándose. Chispas surgían de su garganta, y cuando abrió la boca, un fuego intenso brotó de ella, quemando todo a su paso.</p>
                <p className="italic mt-4">"¿Qué está pasando? ¿Por qué estoy haciendo esto?"</p>
                <p className="mt-4">Pensó, sintiendo cómo una mezcla de ira y rencor se apoderaba de él. Pero no podía detenerse; algo lo impulsaba a destruirlo todo hasta no dejar rastro.</p>
              </div>

              {/* Escena 9: El Arquero */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Arquero</h4>
                <p>Entre las llamas y el caos, distinguió una figura en la cima de un risco. Era un ser humanoide que emanaba una intensa luz, pero su silueta parecía diferente: tenía orejas largas y puntiagudas y sostenía un arco de madera ornamentado.</p>
                <p className="mt-4">El extraño lo miró con seriedad, tensó la cuerda de su arco y disparó.</p>
              </div>

              {/* Escena 10: La Flecha */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">La Flecha</h4>
                <p>La flecha atravesó el aire con velocidad, girando sobre su eje. Pero no era una flecha común; desprendía un aura misteriosa, como la de una mamba blanca. A medida que se acercaba, triplicó su tamaño, y aunque Iverson intentó detenerla, el impacto fue inevitable. La flecha rozó su corazón y se clavó en su hombro.</p>
                <p className="mt-4">El dolor lo sacudió como una descarga eléctrica.</p>
                <p className="italic mt-4">"¿Por qué...? ¿Por qué siento el dolor como si realmente hubiera sido herido? ¿Qué demonios está pasando?"</p>
              </div>

              {/* Escena 11: El Veneno */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Veneno</h4>
                <p>El veneno de la flecha comenzó a extenderse por su cuerpo, quemando sus venas con una intensidad indescriptible. Entonces, una lluvia de flechas descendió del cielo, obligándolo a rugir con fuerza. El rugido creó una onda expansiva que formó un escudo a su alrededor, desvió las flechas... pero no todas.</p>
              </div>

              {/* Escena 12: El Rescate */}
              <div className="mb-8 border-t border-red-500/20 pt-8">
                <h4 className="text-xl font-bold text-red-500 mb-4">El Rescate</h4>
                <p>Entre la tormenta de proyectiles, una flecha gigante, nuevamente en forma de mamba, avanzaba decidida hacia él. Iverson apenas tuvo tiempo de procesarlo antes de que la flecha atravesara su escudo, imparable.</p>
                <p className="mt-4">Justo cuando estaba a punto de impactar, un ser de apariencia similar al del risco surgió de la nada. Con una katana en mano, cortó la flecha en dos, creando un estruendo que resonó por todo el lugar.</p>
                <p className="mt-4">Antes de que Iverson pudiera entender lo que ocurría, una voz retumbó en su mente.</p>
                <p className="italic mt-4">"¡¡¡HUYE!!!"</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = selectedCategory === 'todos'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  // Modal handlers
  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  // Project Modal Component
  const ProjectModal = ({ project }) => {
    const isImagePDF = project.pdfFile?.toLowerCase().endsWith('.pdf');

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
        <div className="bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-red-500">{project.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Image Section */}
            <div className="mb-6">
              {isImagePDF ? (
                <object
                  data={project.pdfFile}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  className="rounded-lg"
                >
                  <p>Tu navegador no puede mostrar el PDF directamente. 
                    <a href={project.pdfFile} target="_blank" rel="noopener noreferrer" 
                       className="text-red-500 hover:text-red-400 ml-2">
                      Haz clic aquí para verlo
                    </a>
                  </p>
                </object>
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">{project.description}</p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FaCalendar />
                <span>{project.details.fecha}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <FaTools className="text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {project.details.herramientas.map((tool, index) => (
                    <span
                      key={index}
                      className="bg-red-500 text-white px-2 py-1 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300">{project.details.descripcionLarga}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Novela Gallery Section
  const novelaImages = [
    {
      src: portadaNovela,
      title: 'Portada de la Novela',
      description: 'La portada oficial de la novela que representa el inicio de esta increíble historia.',
      chapter: 'Portada'
    },
    {
      src: nuevaImagen1,
      title: 'Imagen 1',
      description: 'Ciudad destruida bañada en sangre',
      chapter: 'Capítulo 1'
    },
    {
      src: nuevaImagen2,
      title: 'Imagen 2',
      description: 'Un espacio totalmente en blanco acompañado de un gran trono de cristal',
      chapter: 'Capítulo 2'
    },
    {
      src: nuevaImagen3,
      title: 'Imagen 3',
      description: 'Un bosque de fantasía',
      chapter: 'Capítulo 3'
    },
    {
      src: nuevaImagen4,
      title: 'Imagen 4',
      description: 'Una cueva llena de misterio y angustia',
      chapter: 'Capítulo 4'
    },
    {
      src: nuevaImagen5,
      title: 'Imagen 5',
      description: 'Un gran bosque con casas maravillosas',
      chapter: 'Capítulo 5'
    }
  ];

  // Novela Modal Component
  const NovelaModal = ({ image, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="relative max-w-4xl w-full bg-black/95 p-4 rounded-lg pixel-border"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
          
          <div className="relative aspect-video mb-4">
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="text-white">
            <h3 className="text-2xl font-bold pixel-text text-red-500 mb-2">
              {image.title}
            </h3>
            <p className="text-gray-300 mb-4">
              {image.description}
            </p>
            {image.chapter && (
              <p className="text-sm text-gray-400">
                Capítulo: {image.chapter}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  // Funciones para el modal de la novela
  const openNovelaModal = (image) => {
    setSelectedNovelaImage(image);
    setIsNovelaModalOpen(true);
  };

  const closeNovelaModal = () => {
    setIsNovelaModalOpen(false);
    setSelectedNovelaImage(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <a href="#" className="text-2xl font-bold pixel-text text-red-500">KINGPLAY</a>
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="nav-link pixel-text text-sm">Inicio</a>
              <a href="#portfolio" className="nav-link pixel-text text-sm">Portfolio</a>
              <a href="#novela" className="nav-link pixel-text text-sm">Novela</a>
              <a href="#libro" className="nav-link pixel-text text-sm">Libro</a>
              <a href="#contacto" className="nav-link pixel-text text-sm">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Starfield Background */}
      <div className="starfield" />

      {/* Hero Section */}
      <section id="inicio" className="min-h-screen relative overflow-hidden pixel-bg pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 1 }}
              className="inline-block mb-12"
            >
              <FaCrown className="text-9xl text-red-500 animate-float" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold mb-8 pixel-text text-red-500"
            >
              KINGPLAY
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-white mb-16"
            >
              Aspirante a Diseñador Interactivo
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a href="#portfolio" className="pixel-button text-lg">
                  Ver Portfolio
                </a>
                <a href="#novela" className="pixel-button text-lg">
                  Leer Novela
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Game Section */}
        <div className="relative w-full mt-32 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold pixel-text text-red-500 mb-4">¡Juega Ahora!</h2>
              <p className="text-lg text-white/80">Demuestra tus habilidades en este juego espacial retro</p>
            </motion.div>
            <SpaceGame />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Sobre Mí Section */}
      <section id="sobre-mi" className="min-h-screen relative py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <FaUserAlt className="section-icon" />
            <h2 className="text-4xl font-bold pixel-text text-red-500">Sobre Mí</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="about-card p-8"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-text mb-6"
            >
              Soy <span className="text-red-500 font-bold">KING IVERSON LIVINGSTON HOGISTE</span> Estudiante de Diseño interactivo, 
              de la universidad bellas artes en Colombia, Nacido el 13 de Febrero 2002, 
              Apasionado por los videojuegos, La lectura visual, La ilustración y Creacion de contenido
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="body-text mb-6"
            >
              Vengo de San Andrés Islas, soy detallista, observador y incluso muy expresador en ocasiones
            </motion.p>

            {/* CV Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-[#2D0909] rounded-lg p-8 mt-8 pixel-border"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="flex items-start space-x-4">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-2 border-red-500"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-red-500 pixel-text">CURRÍCULUM VITAE</h3>
                      <h4 className="text-xl text-white mt-2">KING IVERSON</h4>
                      <h4 className="text-xl text-white">LIVINGSTON</h4>
                      <h4 className="text-xl text-white">HOGISTE</h4>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-red-500 mb-4">PERFIL LABORAL</h4>
                    <p className="text-white text-sm leading-relaxed">
                      SOY UN CHICO APASIONADO POR TODO LO TEMÁTICO A VIDEOJUEGOS O INCLUSO EN LA CREACIÓN DE HISTORIAS HACIENDO QUE CUANDO LLEVO UN TRABAJO DE ESTA TEMÁTICA CADA DETALLE QUE HAGO ME EMOCIONE Y BIEN EN ELLO INCLUSO EN PEDIR LA OPINIÓN DE PERSONAS MÁS EXPERIMENTADAS PARA LLEVARLO A UN NIVEL MAYOR
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div>
                    <h4 className="text-lg font-bold text-red-500 mb-4">EXPERIENCIA LABORAL</h4>
                    <p className="text-white">NINGUNA</p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-red-500 mb-4">EDUCACIÓN</h4>
                    <p className="text-white">FUNDACIÓN UNIVERSITARIA BELLAS ARTES</p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-red-500 mb-4">HABILIDADES</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-white mb-2">Drawing</p>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-white mb-2">Web design</p>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-white mb-2">Modelating 3D</p>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-white mb-2">Interactive design</p>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-white mb-2">Animation</p>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-black/30 p-3 rounded-lg"
              >
                <FaGamepad className="text-2xl text-red-500" />
                <span className="body-text">Videojuegos</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-black/30 p-3 rounded-lg"
              >
                <FaBook className="text-2xl text-red-500" />
                <span className="body-text">Lectura Visual</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-black/30 p-3 rounded-lg"
              >
                <FaPaintBrush className="text-2xl text-red-500" />
                <span className="body-text">Ilustración</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-black/30 p-3 rounded-lg"
              >
                <FaTwitch className="text-2xl text-red-500" />
                <span className="body-text">Creación de Contenido</span>
              </motion.div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="body-text italic text-gray-300"
            >
              "Soy alguien dispuesto a recibir consejos y hacerlos míos para poco a poco aprender de ello"
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="min-h-screen relative py-20 px-4 bg-black/90">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <FaCode className="section-icon" />
            <h2 className="text-4xl font-bold pixel-text text-red-500 mb-8">Portfolio</h2>
            
            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg pixel-button text-sm ${
                    selectedCategory === category.id 
                      ? 'bg-red-600 text-white' 
                      : 'bg-black/50 text-gray-300 hover:bg-red-600/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, zIndex: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openModal(project)}
                  className="relative group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg pixel-border aspect-video bg-black">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-bold pixel-text">{project.title}</h3>
                        <p className="text-sm text-gray-300">{project.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Modal */}
          <AnimatePresence>
            {isModalOpen && <ProjectModal project={selectedProject} />}
          </AnimatePresence>

          {/* Mensaje cuando no hay proyectos */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-gray-400">
                Próximamente proyectos en esta categoría...
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Novela Section */}
      <section id="novela" className="min-h-screen relative py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <FaBook className="section-icon" />
            <h2 className="text-4xl font-bold pixel-text text-red-500">Novela</h2>
          </motion.div>

          {isReading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/80 p-8 rounded-lg"
            >
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                  className="pixel-button px-6 py-3 bg-red-500 text-white hover:bg-black hover:text-red-500 transition-all duration-300 hover:shadow-[0_0_8px_rgba(239,68,68,0.8)] disabled:opacity-50 disabled:hover:bg-red-500 disabled:hover:text-white disabled:hover:shadow-none"
                  disabled={currentChapter === 0}
                >
                  <FaChevronLeft className="mr-2" />
                  Anterior
                </button>
                <div className="text-center max-w-[60%] mx-auto">
                  {chapters[currentChapter].id === 1 ? (
                    <>
                      <h3 className="text-[2.5rem] font-bold pixel-text text-red-500 leading-tight break-words">
                        CAPÍTULO 1: UN NUEVO COMIENZO
                      </h3>
                      <h4 className="text-2xl font-bold pixel-text text-cyan-400 mt-2 break-words">
                        LA HUMANIDAD SE ABRE PASO
                      </h4>
                    </>
                  ) : (
                    <h3 className="text-2xl font-bold pixel-text text-red-500 break-words">
                      {chapters[currentChapter].title}
                    </h3>
                  )}
                </div>
                <button
                  onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
                  className="pixel-button px-6 py-3 bg-red-500 text-white hover:bg-black hover:text-red-500 transition-all duration-300 hover:shadow-[0_0_8px_rgba(239,68,68,0.8)] disabled:opacity-50 disabled:hover:bg-red-500 disabled:hover:text-white disabled:hover:shadow-none"
                  disabled={currentChapter === chapters.length - 1}
                >
                  Siguiente
                  <FaChevronRight className="ml-2" />
                </button>
              </div>

              <div className="chapter-content prose prose-invert mb-8">
                <div className="max-w-2xl mx-auto text-[1.125rem] leading-relaxed text-[#f2f2f2]">
                  {chapters[currentChapter].content}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="pixel-button"
                >
                  <FaComments className="mr-2" />
                  {showComments ? 'Ocultar Comentarios' : 'Ver Comentarios'}
                </button>
                <button
                  onClick={() => setIsReading(false)}
                  className="pixel-button"
                >
                  <FaBookOpen className="mr-2" />
                  Volver a la Portada
                </button>
              </div>

              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-8"
                >
                  <h4 className="text-xl font-bold pixel-text text-red-500 mb-4">Comentarios</h4>
                  <div className="space-y-4">
                    <textarea
                      className="comment-input w-full h-24 resize-none"
                      placeholder="Escribe tu comentario..."
                    />
                    <button className="pixel-button">
                      Enviar Comentario
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D0909] pixel-border p-6 rounded-lg max-w-md mx-auto"
            >
              <div className="novel-cover mb-6">
                <img
                  src={portadaNovela}
                  alt="Portada de la Novela"
                  className="w-full h-full object-cover rounded-lg shadow-lg shadow-red-500/20"
                />
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold pixel-text text-white">New Beginning</h3>
                <p className="text-xl text-gray-300">Una Odisea entre la Realidad y lo Sobrenatural</p>
                <p className="text-gray-400">Por King Iverson Livingston Hogiste</p>
                
                <div className="mt-8 space-y-4 text-left text-sm text-gray-300">
                  <div>
                    <h4 className="font-bold text-red-500 mb-2">Copyright</h4>
                    <p>© 2025 por King Iverson Livingston Hogiste</p>
                    <p>Todos los derechos reservados.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-red-500 mb-2">Dedicatoria</h4>
                    <p>A mi profesor, por impulsarme a la creación de este proyecto y por su invaluable retroalimentación, y a Sara, por ayudarme a transformar la historia al formato manga. Su apoyo y guía han sido fundamentales en este camino creativo.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-red-500 mb-2">Índice</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Capítulo 1: Un Nuevo Comienzo / La Humanidad se Abre Paso (2)</li>
                      <li>Capítulo 2: Un Mundo Nuevo que Descubrir (5)</li>
                      <li>Capítulo 3: Nuevas Adversidades se Aproximan (7)</li>
                      <li>Capítulo 4: Un Nuevo Elegido por Dios Presente? (9)</li>
                      <li>Capítulo 5: ¿Esa Criatura es lo que Creo? (11)</li>
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => setIsReading(true)}
                  className="pixel-button w-full mt-8"
                >
                  COMENZAR LECTURA
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Libro Section */}
      <section id="libro" className="min-h-[40vh] py-20 px-4 bg-black flex items-center justify-center">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-16">
          {/* Portada */}
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img
              src={portadaLibro}
              alt="Portada EL DESPERTAR DE LAS ALMAS"
              className="object-cover w-full h-72 max-w-xs rounded-lg shadow-lg"
            />
          </div>
          {/* Info */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h3 className="text-4xl font-bold pixel-text text-red-500 mb-2">EL DESPERTAR DE LAS ALMAS</h3>
            <p className="text-white text-lg mb-4">Próximamente</p>
            <div className="text-gray-200 text-base mb-6">
              <h4 className="font-bold text-red-500 mb-2">Sinopsis</h4>
              <p>
                En un mundo semifuturista, la ciudad de Nexópolis se erige como un refugio de paz y felicidad. Humanos y tecnología conviven en perfecta armonía, construyendo una sociedad próspera y avanzada.<br /><br />
                Sin embargo, esa aparente estabilidad se ve abruptamente quebrada cuando fenómenos anormales comienzan a sacudir la ciudad: el suelo se resquebraja y el cielo, teñido de un ominoso rojo, se parte en dos.<br /><br />
                De la hendidura celeste desciende un gigantesco ente, trayendo consigo caos y destrucción, y marcando el inicio de una nueva y aterradora era para los habitantes de Nexópolis.
              </p>
            </div>
            <button className="pixel-button bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-all duration-300 w-fit">
              Leer próximamente
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="min-h-screen relative py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <FaEnvelope className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-6xl font-bold pixel-text text-red-500">CONTACTO</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/80 border-2 border-red-500 p-8 rounded-lg shadow-lg shadow-red-500/20"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="block text-white mb-2 font-['Press_Start_2P'] text-sm">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-red-500/30 focus:border-red-500 rounded text-white outline-none transition-all duration-300"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 font-['Press_Start_2P']">{formErrors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-white mb-2 font-['Press_Start_2P'] text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-red-500/30 focus:border-red-500 rounded text-white outline-none transition-all duration-300"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1 font-['Press_Start_2P']">{formErrors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-white mb-2 font-['Press_Start_2P'] text-sm">Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-red-500/30 focus:border-red-500 rounded text-white outline-none transition-all duration-300"
                  />
                  {formErrors.subject && (
                    <p className="text-red-500 text-sm mt-1 font-['Press_Start_2P']">{formErrors.subject}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-white mb-2 font-['Press_Start_2P'] text-sm">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 bg-black/40 border-2 border-red-500/30 focus:border-red-500 rounded text-white outline-none resize-none transition-all duration-300"
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1 font-['Press_Start_2P']">{formErrors.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-['Press_Start_2P'] py-4 px-8 rounded transition-all duration-300 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={Object.keys(formErrors).length > 0}
                >
                  ENVIAR MENSAJE
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black/80 border-2 border-red-500 p-8 rounded-lg shadow-lg shadow-red-500/20"
            >
              <h3 className="text-3xl font-bold pixel-text text-red-500 mb-8">
                INFORMACIÓN DE CONTACTO
              </h3>

              <div className="space-y-6 mb-8">
                <motion.a
                  href="mailto:Iverson51241@gmail.com"
                  className="flex items-center space-x-4 text-white hover:text-red-500 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <FaEnvelope className="text-red-500 text-xl" />
                  <span className="font-['Press_Start_2P'] text-sm">Iverson51241@gmail.com</span>
                </motion.a>

                <motion.a
                  href="tel:+573158184852"
                  className="flex items-center space-x-4 text-white hover:text-red-500 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <FaPhone className="text-red-500 text-xl" />
                  <span className="font-['Press_Start_2P'] text-sm">+57 3158184852</span>
                </motion.a>

                <motion.div
                  className="flex items-center space-x-4 text-white"
                  whileHover={{ x: 5 }}
                >
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                  <span className="font-['Press_Start_2P'] text-sm">Cra 80c #31 - 101</span>
                </motion.div>
              </div>

              <h3 className="text-2xl font-bold pixel-text text-red-500 mb-6">
                REDES SOCIALES
              </h3>

              <div className="flex justify-center space-x-8">
                <motion.a
                  href="https://www.instagram.com/kingplay_art/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-red-500 hover:text-red-400 transition-all duration-300"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagram />
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@kingplay_art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-red-500 hover:text-red-400 transition-all duration-300"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaYoutube />
                </motion.a>
                <motion.a
                  href="https://www.twitch.tv/kingplay_art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-red-500 hover:text-red-400 transition-all duration-300"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTwitch />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Novela Gallery Section */}
      <section id="novela-gallery" className="min-h-screen relative py-20 px-4 bg-black/90">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <FaBookOpen className="section-icon" />
            <h2 className="text-4xl font-bold pixel-text text-red-500 mb-8">Galería de la Novela</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Explora las ilustraciones y momentos más destacados de la novela. Cada imagen cuenta una parte de la historia.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {novelaImages.map((image, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, zIndex: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openNovelaModal(image)}
                  className="cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg pixel-border aspect-video bg-black">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-bold pixel-text">{image.title}</h3>
                        <p className="text-sm text-gray-300">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Novela Modal */}
          <AnimatePresence>
            {isNovelaModalOpen && selectedNovelaImage && (
              <NovelaModal image={selectedNovelaImage} onClose={closeNovelaModal} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

export default App;