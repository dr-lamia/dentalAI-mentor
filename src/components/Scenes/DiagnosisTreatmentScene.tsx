import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FileImage, CheckCircle, XCircle, Clock, Award, Zap, AlertCircle, User, Calendar, Stethoscope } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Question, CaseStudy } from '../../types';

const DiagnosisTreatmentScene: React.FC = () => {
  const { state, dispatch } = useGame();
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [caseResults, setCaseResults] = useState<{correct: number, incorrect: number}>({correct: 0, incorrect: 0});

  // Comprehensive case studies covering different specialties and scenarios
  const caseStudies: CaseStudy[] = [
    {
      id: 'case-1',
      title: 'Acute Endodontic Emergency',
      patientHistory: 'A 45-year-old patient presents with severe, spontaneous pain in the lower right posterior region. Pain started 3 days ago and has been keeping the patient awake at night. Patient reports sensitivity to hot and cold, with lingering pain after stimulus removal. Medical history: Hypertension controlled with medication.',
      clinicalFindings: [
        'Deep carious lesion on tooth #30 (mandibular right first molar)',
        'Positive response to cold test with lingering pain (>30 seconds)',
        'Positive percussion test',
        'No swelling or sinus tract present',
        'Probing depths within normal limits',
        'Patient reports pain level 8/10'
      ],
      labResults: ['Vitality test: Positive but prolonged response', 'Radiographic examination: Periapical radiolucency present'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'endodontics',
      difficulty: 'medium',
      questions: [
        {
          id: 'q1',
          question: 'Based on the clinical presentation and radiographic findings, what is the most likely diagnosis?',
          options: [
            'Reversible pulpitis',
            'Irreversible pulpitis with apical periodontitis',
            'Necrotic pulp with acute apical abscess',
            'Cracked tooth syndrome'
          ],
          correctAnswer: 1,
          explanation: 'The combination of spontaneous pain, lingering response to cold, positive percussion, and periapical radiolucency indicates irreversible pulpitis with apical periodontitis. The pulp is inflamed beyond repair but not yet necrotic, as evidenced by the positive vitality test.',
          specialty: 'endodontics',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        },
        {
          id: 'q2',
          question: 'What is the most appropriate immediate treatment for this patient?',
          options: [
            'Prescribe antibiotics and schedule follow-up',
            'Perform pulpotomy and temporary restoration',
            'Initiate root canal treatment',
            'Extract the tooth'
          ],
          correctAnswer: 2,
          explanation: 'Root canal treatment is indicated for irreversible pulpitis. The goal is to remove the inflamed pulp tissue, clean and shape the canal system, and provide proper obturation to prevent reinfection.',
          specialty: 'endodontics',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-2',
      title: 'Advanced Periodontal Disease',
      patientHistory: 'A 52-year-old patient with a history of diabetes presents for routine dental examination. Patient reports bleeding gums during brushing and occasional bad breath. No pain reported. Smokes 1 pack per day for 20 years. Last dental cleaning was 3 years ago.',
      clinicalFindings: [
        'Generalized gingival inflammation and bleeding on probing',
        'Probing depths ranging from 4-7mm in posterior regions',
        'Clinical attachment loss of 3-5mm',
        'Moderate plaque and calculus deposits',
        'Grade II mobility on teeth #18 and #31',
        'Furcation involvement on mandibular molars'
      ],
      labResults: ['HbA1c: 8.2% (poorly controlled diabetes)', 'Recent medical history: Type 2 diabetes for 10 years'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'periodontics',
      difficulty: 'medium',
      questions: [
        {
          id: 'q3',
          question: 'According to the 2017 World Workshop Classification, how would you stage this periodontal condition?',
          options: [
            'Stage I Periodontitis',
            'Stage II Periodontitis',
            'Stage III Periodontitis',
            'Stage IV Periodontitis'
          ],
          correctAnswer: 2,
          explanation: 'Stage III Periodontitis is characterized by clinical attachment loss of 3-4mm, probing depths ≥6mm, and tooth mobility. The presence of Grade II mobility and furcation involvement confirms Stage III classification.',
          specialty: 'periodontics',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        },
        {
          id: 'q4',
          question: 'What grade would you assign based on the risk factors present?',
          options: [
            'Grade A (slow progression)',
            'Grade B (moderate progression)',
            'Grade C (rapid progression)',
            'Cannot determine from given information'
          ],
          correctAnswer: 2,
          explanation: 'Grade C is indicated due to multiple risk factors: smoking (>10 cigarettes/day), poorly controlled diabetes (HbA1c >7%), and the extent of destruction relative to biofilm deposits.',
          specialty: 'periodontics',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-3',
      title: 'Pediatric Dental Trauma',
      patientHistory: 'An 8-year-old child presents to the emergency clinic after falling from a bicycle 2 hours ago. The child hit their face on the pavement. Parents report the child was unconscious briefly but is now alert. The child is crying and complaining of tooth pain.',
      clinicalFindings: [
        'Fractured crown of tooth #8 (maxillary right central incisor)',
        'Exposed dentin visible, no pulp exposure',
        'Tooth is tender to percussion',
        'No mobility detected',
        'Laceration on upper lip (minor)',
        'No other facial injuries noted'
      ],
      labResults: ['Vitality test: Positive response to cold', 'No radiographic abnormalities in root or surrounding bone'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'pedodontics',
      difficulty: 'easy',
      questions: [
        {
          id: 'q5',
          question: 'According to the WHO classification, this fracture would be classified as:',
          options: [
            'Class I - Enamel fracture only',
            'Class II - Enamel and dentin fracture',
            'Class III - Enamel, dentin, and pulp fracture',
            'Class IV - Root fracture'
          ],
          correctAnswer: 1,
          explanation: 'Class II fractures involve both enamel and dentin but do not expose the pulp. The exposed dentin is visible but no pulp exposure is noted in the clinical findings.',
          specialty: 'pedodontics',
          difficulty: 'easy',
          points: 10,
          type: 'multiple-choice'
        },
        {
          id: 'q6',
          question: 'What is the most appropriate immediate treatment?',
          options: [
            'No treatment needed, monitor only',
            'Composite restoration to cover exposed dentin',
            'Pulp cap and composite restoration',
            'Root canal treatment'
          ],
          correctAnswer: 1,
          explanation: 'For Class II fractures with vital pulp, the immediate treatment is to cover the exposed dentin with a composite restoration to prevent bacterial contamination and sensitivity.',
          specialty: 'pedodontics',
          difficulty: 'easy',
          points: 10,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-4',
      title: 'Oral Pathology Lesion',
      patientHistory: 'A 65-year-old male presents with a white patch on the lateral border of his tongue that he noticed 3 weeks ago. He has a 40-year history of smoking and drinks alcohol daily. The lesion is painless but feels rough to his tongue. No recent dental work or trauma to the area.',
      clinicalFindings: [
        'White plaque-like lesion on left lateral tongue border',
        'Lesion measures approximately 2cm x 1cm',
        'Cannot be wiped off with gauze',
        'Slightly raised with irregular borders',
        'No ulceration present',
        'No palpable lymph nodes'
      ],
      labResults: ['No systemic symptoms', 'Patient reports no weight loss or difficulty swallowing'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'oral-medicine',
      difficulty: 'hard',
      questions: [
        {
          id: 'q7',
          question: 'What is the most likely diagnosis for this lesion?',
          options: [
            'Oral thrush (candidiasis)',
            'Leukoplakia',
            'Lichen planus',
            'Traumatic ulcer'
          ],
          correctAnswer: 1,
          explanation: 'Leukoplakia is characterized by white patches that cannot be wiped off and cannot be attributed to any other condition. The location, appearance, and risk factors (smoking, alcohol) are consistent with leukoplakia.',
          specialty: 'oral-medicine',
          difficulty: 'hard',
          points: 15,
          type: 'multiple-choice'
        },
        {
          id: 'q8',
          question: 'What is the most appropriate next step in management?',
          options: [
            'Prescribe antifungal medication',
            'Recommend smoking cessation and monitor',
            'Perform incisional biopsy',
            'Apply topical corticosteroids'
          ],
          correctAnswer: 2,
          explanation: 'Any persistent white lesion that cannot be diagnosed clinically should be biopsied to rule out dysplasia or malignancy, especially in high-risk patients with tobacco and alcohol use.',
          specialty: 'oral-medicine',
          difficulty: 'hard',
          points: 15,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-5',
      title: 'Orthodontic Malocclusion',
      patientHistory: 'A 12-year-old patient presents for orthodontic consultation. Parents are concerned about crowded front teeth and difficulty chewing. The child is in mixed dentition with all permanent incisors and first molars erupted. No previous orthodontic treatment.',
      clinicalFindings: [
        'Class II molar relationship bilaterally',
        'Overjet of 8mm',
        'Overbite of 6mm (deep bite)',
        'Crowding in anterior region (4mm space deficiency)',
        'Narrow maxillary arch',
        'Mouth breathing habit observed'
      ],
      labResults: ['Cephalometric analysis shows ANB angle of 7°', 'Panoramic radiograph shows all permanent teeth developing normally'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'orthodontics',
      difficulty: 'medium',
      questions: [
        {
          id: 'q9',
          question: 'Based on the clinical findings, what is the primary malocclusion classification?',
          options: [
            'Class I malocclusion with crowding',
            'Class II Division 1 malocclusion',
            'Class II Division 2 malocclusion',
            'Class III malocclusion'
          ],
          correctAnswer: 1,
          explanation: 'Class II Division 1 is characterized by Class II molar relationship, increased overjet (>4mm), and often deep overbite. The large overjet of 8mm confirms this classification.',
          specialty: 'orthodontics',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        },
        {
          id: 'q10',
          question: 'What would be the most appropriate initial treatment approach?',
          options: [
            'Extract four premolars and begin fixed appliances',
            'Palatal expansion followed by comprehensive orthodontics',
            'Wait until all permanent teeth erupt',
            'Functional appliance therapy'
          ],
          correctAnswer: 3,
          explanation: 'For growing patients with Class II malocclusion, functional appliance therapy can help correct the skeletal discrepancy and improve facial profile while the patient is still growing.',
          specialty: 'orthodontics',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-6',
      title: 'Oral Surgery Consultation',
      patientHistory: 'A 25-year-old patient presents with pain and swelling around the lower right wisdom tooth. Symptoms started 1 week ago and have been getting progressively worse. Patient reports difficulty opening mouth and swallowing. No fever but feels generally unwell.',
      clinicalFindings: [
        'Partially erupted tooth #32 (mandibular right third molar)',
        'Inflamed and swollen gingiva around tooth',
        'Purulent discharge from gingival pocket',
        'Limited mouth opening (25mm)',
        'Tender submandibular lymph nodes',
        'Halitosis present'
      ],
      labResults: ['Temperature: 99.8°F', 'No signs of facial cellulitis'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'oral-surgery',
      difficulty: 'medium',
      questions: [
        {
          id: 'q11',
          question: 'What is the most likely diagnosis?',
          options: [
            'Acute pericoronitis',
            'Periodontal abscess',
            'Acute pulpitis',
            'Dry socket'
          ],
          correctAnswer: 0,
          explanation: 'Acute pericoronitis is inflammation of the gingiva around a partially erupted tooth, commonly affecting third molars. The symptoms of pain, swelling, purulent discharge, and trismus are characteristic.',
          specialty: 'oral-surgery',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        },
        {
          id: 'q12',
          question: 'What is the most appropriate immediate treatment?',
          options: [
            'Immediate extraction of the tooth',
            'Irrigation and debridement with antibiotics',
            'Root canal treatment',
            'Incision and drainage only'
          ],
          correctAnswer: 1,
          explanation: 'Initial treatment for acute pericoronitis includes irrigation and debridement of the area, along with antibiotics if systemic involvement is present. Extraction may be considered after acute symptoms resolve.',
          specialty: 'oral-surgery',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-7',
      title: 'Prosthodontic Rehabilitation',
      patientHistory: 'A 58-year-old patient presents for full mouth rehabilitation. Patient has multiple missing teeth and wants to improve function and esthetics. History of periodontal disease, now stable. Patient is a non-smoker and has well-controlled diabetes.',
      clinicalFindings: [
        'Missing teeth: #3, #14, #19, #30, #31',
        'Existing crowns on #8, #9 with poor margins',
        'Generalized moderate wear on remaining teeth',
        'Stable periodontal condition',
        'Adequate bone height for implants',
        'Good oral hygiene'
      ],
      labResults: ['Recent HbA1c: 6.8%', 'No contraindications to dental treatment'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'prosthodontics',
      difficulty: 'hard',
      questions: [
        {
          id: 'q13',
          question: 'What would be the most appropriate treatment plan for the posterior missing teeth?',
          options: [
            'Removable partial dentures',
            'Implant-supported crowns',
            'Fixed partial dentures (bridges)',
            'No treatment needed'
          ],
          correctAnswer: 1,
          explanation: 'Given the patient\'s good oral hygiene, stable periodontal condition, adequate bone, and controlled diabetes, implant-supported crowns would provide the best long-term solution for missing posterior teeth.',
          specialty: 'prosthodontics',
          difficulty: 'hard',
          points: 15,
          type: 'multiple-choice'
        },
        {
          id: 'q14',
          question: 'For the existing crowns with poor margins, what is the best approach?',
          options: [
            'Leave as is if asymptomatic',
            'Replace with new crowns',
            'Repair margins with composite',
            'Extract teeth and place implants'
          ],
          correctAnswer: 1,
          explanation: 'Poor crown margins can lead to recurrent decay and periodontal problems. In a comprehensive treatment plan, these should be replaced with properly fitting crowns.',
          specialty: 'prosthodontics',
          difficulty: 'hard',
          points: 15,
          type: 'multiple-choice'
        }
      ]
    },
    {
      id: 'case-8',
      title: 'Dental Radiology Interpretation',
      patientHistory: 'A 35-year-old patient presents for routine examination. No symptoms reported. Patient has a history of orthodontic treatment completed 5 years ago. Regular dental visits every 6 months with good oral hygiene.',
      clinicalFindings: [
        'All teeth present and in good alignment',
        'No visible caries on clinical examination',
        'Healthy gingiva with no bleeding on probing',
        'No mobility or percussion sensitivity',
        'Patient reports no pain or sensitivity',
        'Routine bitewing radiographs taken'
      ],
      labResults: ['Bitewing radiographs show radiolucency between #13 and #14', 'No other radiographic abnormalities noted'],
      images: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      xrays: ['https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg'],
      specialty: 'radiology',
      difficulty: 'medium',
      questions: [
        {
          id: 'q15',
          question: 'What is the most likely explanation for the radiolucency between #13 and #14?',
          options: [
            'Interproximal caries',
            'Cervical burnout',
            'External root resorption',
            'Periodontal bone loss'
          ],
          correctAnswer: 0,
          explanation: 'A radiolucency between teeth on bitewing radiographs most commonly represents interproximal caries, especially when clinical examination doesn\'t reveal obvious cavitation.',
          specialty: 'radiology',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        },
        {
          id: 'q16',
          question: 'What is the most appropriate next step?',
          options: [
            'Continue monitoring at next visit',
            'Clinical examination with explorer',
            'Take additional radiographs',
            'Restore both teeth immediately'
          ],
          correctAnswer: 1,
          explanation: 'When radiographic caries is suspected but not clinically visible, careful clinical examination with appropriate instruments can help confirm the diagnosis and determine treatment needs.',
          specialty: 'radiology',
          difficulty: 'medium',
          points: 10,
          type: 'multiple-choice'
        }
      ]
    }
  ];

  useEffect(() => {
    if (currentCase && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentCase, timeRemaining]);

  const startCase = (caseStudy: CaseStudy) => {
    setCurrentCase(caseStudy);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setTimeRemaining(300);
    setCaseResults({correct: 0, incorrect: 0});
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentCase) return;

    const currentQuestion = currentCase.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
      setCaseResults(prev => ({...prev, correct: prev.correct + 1}));
      dispatch({ type: 'EARN_XP', payload: currentQuestion.points });
    } else {
      setCaseResults(prev => ({...prev, incorrect: prev.incorrect + 1}));
      dispatch({ type: 'EARN_XP', payload: -5 });
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!currentCase) return;

    if (currentQuestionIndex < currentCase.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Case completed
      completeCase();
    }
  };

  const completeCase = () => {
    if (!currentCase) return;

    const accuracy = (caseResults.correct / currentCase.questions.length) * 100;
    let badge = null;

    if (accuracy >= 90) {
      badge = {
        id: `diagnostic-expert-${Date.now()}`,
        name: 'Diagnostic Expert',
        description: 'Achieved 90%+ accuracy in case diagnosis',
        icon: '🎯',
        earnedAt: new Date(),
        rarity: 'epic' as const,
        color: 'text-purple-500'
      };
      dispatch({ type: 'EARN_BADGE', payload: badge });
    }

    // Reset case
    setCurrentCase(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      'endodontics': 'from-red-500 to-red-600',
      'periodontics': 'from-green-500 to-green-600',
      'pedodontics': 'from-pink-500 to-pink-600',
      'oral-medicine': 'from-purple-500 to-purple-600',
      'orthodontics': 'from-blue-500 to-blue-600',
      'oral-surgery': 'from-orange-500 to-orange-600',
      'prosthodontics': 'from-indigo-500 to-indigo-600',
      'radiology': 'from-teal-500 to-teal-600'
    };
    return colors[specialty] || 'from-gray-500 to-gray-600';
  };

  const getSpecialtyIcon = (specialty: string) => {
    const icons: Record<string, string> = {
      'endodontics': '🦷',
      'periodontics': '🫧',
      'pedodontics': '🧸',
      'oral-medicine': '🔬',
      'orthodontics': '🦴',
      'oral-surgery': '🔪',
      'prosthodontics': '👑',
      'radiology': '📸'
    };
    return icons[specialty] || '🏥';
  };

  if (!currentCase) {
    return (
      <div className="h-full bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Clinical Case Studies</h1>
            <p className="text-gray-600 text-lg">Analyze diverse clinical cases across all dental specialties to develop your diagnostic skills</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy) => (
              <motion.div
                key={caseStudy.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => startCase(caseStudy)}
              >
                <div className={`h-32 bg-gradient-to-br ${getSpecialtyColor(caseStudy.specialty)} relative flex items-center justify-center`}>
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">{getSpecialtyIcon(caseStudy.specialty)}</div>
                    <h3 className="text-lg font-bold">{caseStudy.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium capitalize">{caseStudy.difficulty}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{caseStudy.questions.length} Questions</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Patient Case</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                        {caseStudy.specialty.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">{caseStudy.patientHistory}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Key Findings
                    </h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {caseStudy.clinicalFindings.slice(0, 3).map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="line-clamp-1">{finding}</span>
                        </li>
                      ))}
                      {caseStudy.clinicalFindings.length > 3 && (
                        <li className="text-gray-400 text-xs">+{caseStudy.clinicalFindings.length - 3} more findings</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>5 min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{caseStudy.questions.reduce((sum, q) => sum + q.points, 0)} XP</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      caseStudy.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      caseStudy.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {caseStudy.difficulty}
                    </div>
                  </div>

                  <button className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>Start Case Analysis</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Specialty Filter */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Specialty</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from(new Set(caseStudies.map(c => c.specialty))).map((specialty) => (
                <button
                  key={specialty}
                  className="p-3 text-center bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-1">{getSpecialtyIcon(specialty)}</div>
                  <div className="text-xs font-medium text-gray-700 capitalize">
                    {specialty.replace('-', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentCase.questions[currentQuestionIndex];

  return (
    <div className="h-full flex bg-gray-50">
      {/* Case Information Panel */}
      <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{currentCase.title}</h2>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className={`font-mono ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className={`px-3 py-1 rounded-full capitalize ${
                currentCase.specialty === 'endodontics' ? 'bg-red-100 text-red-700' :
                currentCase.specialty === 'periodontics' ? 'bg-green-100 text-green-700' :
                currentCase.specialty === 'pedodontics' ? 'bg-pink-100 text-pink-700' :
                currentCase.specialty === 'oral-medicine' ? 'bg-purple-100 text-purple-700' :
                currentCase.specialty === 'orthodontics' ? 'bg-blue-100 text-blue-700' :
                currentCase.specialty === 'oral-surgery' ? 'bg-orange-100 text-orange-700' :
                currentCase.specialty === 'prosthodontics' ? 'bg-indigo-100 text-indigo-700' :
                'bg-teal-100 text-teal-700'
              }`}>
                {currentCase.specialty.replace('-', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full capitalize ${
                currentCase.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentCase.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentCase.difficulty}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {currentCase.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentCase.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Score */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Current Score</p>
                <p className="text-2xl font-bold">{score} XP</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-300" />
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>{caseResults.correct} Correct</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="w-4 h-4 text-red-300" />
                <span>{caseResults.incorrect} Incorrect</span>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Patient Information
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <div className="flex justify-between">
                <span>Age:</span>
                <span className="font-medium">
                  {currentCase.patientHistory.match(/(\d+)-year-old/)?.[1] || 'N/A'} years
                </span>
              </div>
              <div className="flex justify-between">
                <span>Chief Complaint:</span>
                <span className="font-medium">Pain/Discomfort</span>
              </div>
            </div>
          </div>

          {/* Patient History */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Patient History</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{currentCase.patientHistory}</p>
          </div>

          {/* Clinical Findings */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Clinical Findings</h3>
            <ul className="space-y-2">
              {currentCase.clinicalFindings.map((finding, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-600">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lab Results */}
          {currentCase.labResults && currentCase.labResults.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Lab Results & Additional Tests</h3>
              <ul className="space-y-2">
                {currentCase.labResults.map((result, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span className="text-gray-600">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col">
        {/* Images/X-rays */}
        <div className="h-64 bg-black flex items-center justify-center border-b border-gray-200">
          <div className="flex space-x-4">
            {currentCase.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Clinical image ${index + 1}`}
                  className="h-56 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Clinical Photo {index + 1}
                </div>
              </div>
            ))}
            {currentCase.xrays.map((xray, index) => (
              <div key={`xray-${index}`} className="relative">
                <img
                  src={xray}
                  alt={`X-ray ${index + 1}`}
                  className="h-56 object-cover rounded-lg shadow-lg border-2 border-blue-400"
                />
                <div className="absolute bottom-2 left-2 bg-blue-600/80 text-white px-2 py-1 rounded text-xs">
                  Radiograph {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {currentQuestionIndex + 1}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Question {currentQuestionIndex + 1}</h2>
                <div className="ml-auto flex items-center space-x-2 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>{currentQuestion.points} points</span>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">{currentQuestion.question}</p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-500 bg-blue-50 text-blue-800'
                      : showExplanation && index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showExplanation && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 ml-auto text-green-500" />
                    )}
                    {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 ml-auto text-red-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Clinical Explanation</h3>
                      <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentCase(null)}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Exit Case
              </button>
              
              {!showExplanation ? (
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
                >
                  {currentQuestionIndex < currentCase.questions.length - 1 ? 'Next Question' : 'Complete Case'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTreatmentScene;