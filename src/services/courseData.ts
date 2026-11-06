import { ContentItem, LiveClassItem, ResolvedMedia } from '../types';

// Default thumbnails for subjects & high quality lecture cards
const THUMB_PHYSICS = 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/content/thumbnail/7805915_149_Screenshot%202026-10-14%20at%208.08.07%E2%80%AFPM.png';
const THUMB_CHEMISTRY = 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/content/thumbnail/6829453_149_WhatsApp%20Image%202026-10-08%20at%2014.15.57.jpeg';
const THUMB_MATHS = 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/content/thumbnail/7783667_149_Screenshot%202026-10-14%20at%2012.30.22%E2%80%AFPM.png';
const THUMB_BOTANY = 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/4072473_131_Class%2011th%20Mission%20Jeets%20NEET%20App%20Banners.jpg';
const THUMB_ZOOLOGY = 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/241318_131_drona%202.0%20NEET%20banner%20app.png';
const THUMB_DEFAULT = 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/7574748_131_Class%2011th%20Mission%20Jeet%20JEE%20App%20Banners.jpg';

// Standard working video lecture streams (Real CloudFront Kota Classroom Lectures & Educational streams)
export const LECTURE_VIDEO_URLS = [
  'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4767844/1779196053_4502928520893716/177919292394489029618_720',
  'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4768824/1779282902_8151791412742851/177927979185549029618_720',
  'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4769737/1779369850_5220160857741270/177936597653179029618_720',
  'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4772274/1779712153_2586305600258026/177971199032489029618_720',
  'https://www.youtube.com/watch?v=0k2xQ0uR0mQ',
  'https://www.youtube.com/watch?v=8mvykP8iJ_4'
];

// Standard working PDF URLs
export const LECTURE_PDF_URLS = [
  'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://ncert.nic.in/textbook/pdf/keph101.pdf',
  'https://ncert.nic.in/textbook/pdf/keph102.pdf',
  'https://ncert.nic.in/textbook/pdf/lech101.pdf',
  'https://ncert.nic.in/textbook/pdf/jemh101.pdf'
];

// In-memory registry for media resolution
export const MEDIA_REGISTRY = new Map<string, ResolvedMedia>();

export function registerMedia(courseId: string | number, contentId: string | number, media: Partial<ResolvedMedia['decryptedData']>) {
  const key = `${courseId}_${contentId}`;
  MEDIA_REGISTRY.set(key, {
    courseId: String(courseId),
    contentId: String(contentId),
    decryptedData: {
      id: Number(contentId) || Math.floor(Math.random() * 10000),
      title: media.title || 'GB Study Lecture',
      description: media.description || 'Complete Kota faculty lecture with full concept clarity.',
      thumbnail: media.thumbnail || THUMB_DEFAULT,
      file_url: media.file_url || LECTURE_VIDEO_URLS[0],
      file_type: media.file_type ?? 2,
      video_type: media.video_type ?? 4,
      duration: media.duration || 3600,
      is_live: media.is_live ?? 0,
      download_urls: media.download_urls || [
        { title: '720', url: media.file_url || LECTURE_VIDEO_URLS[0] },
        { title: '480', url: media.file_url || LECTURE_VIDEO_URLS[0] },
        { title: '360', url: media.file_url || LECTURE_VIDEO_URLS[0] }
      ]
    }
  });
}

// Helper to build Subject folders for root folder "0"
export function getBatchSubjects(batchId: number | string): ContentItem[] {
  const bId = Number(batchId);
  const cId = String(batchId);

  if (bId === 251) {
    // All INDIA TEST SERIES - JEE 11th
    return [
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b251_phy`,
        title: 'Physics AITS - Mock Tests & Video Analysis',
        data: {
          id: 25101,
          thumbnail: THUMB_PHYSICS,
          content_counts: { folders: { total: 10, direct: 10 }, video: { paid: 40, free: 5 }, pdf: { paid: 45, free: 8 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b251_chem`,
        title: 'Chemistry AITS - Mock Tests & Video Analysis',
        data: {
          id: 25102,
          thumbnail: THUMB_CHEMISTRY,
          content_counts: { folders: { total: 10, direct: 10 }, video: { paid: 40, free: 5 }, pdf: { paid: 45, free: 8 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b251_math`,
        title: 'Mathematics AITS - Mock Tests & Video Analysis',
        data: {
          id: 25103,
          thumbnail: THUMB_MATHS,
          content_counts: { folders: { total: 10, direct: 10 }, video: { paid: 40, free: 5 }, pdf: { paid: 45, free: 8 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b251_full`,
        title: 'JEE Main & Advanced Full Syllabus Tests (300M)',
        data: {
          id: 25104,
          thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/3913128_131_JEE%20AITS%20%281%29.png',
          content_counts: { folders: { total: 8, direct: 8 }, video: { paid: 25, free: 3 }, pdf: { paid: 30, free: 5 } }
        }
      }
    ];
  }

  if (bId === 250) {
    // All INDIA TEST SERIES - NEET 11th
    return [
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b250_phy`,
        title: 'Physics NEET AITS - Tests & Detailed Video Solution',
        data: {
          id: 25001,
          thumbnail: THUMB_PHYSICS,
          content_counts: { folders: { total: 10, direct: 10 }, video: { paid: 35, free: 4 }, pdf: { paid: 40, free: 6 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b250_chem`,
        title: 'Chemistry NEET AITS - Tests & Detailed Video Solution',
        data: {
          id: 25002,
          thumbnail: THUMB_CHEMISTRY,
          content_counts: { folders: { total: 10, direct: 10 }, video: { paid: 35, free: 4 }, pdf: { paid: 40, free: 6 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b250_bio`,
        title: 'Biology (Botany & Zoology) NEET AITS 360/360 Special',
        data: {
          id: 25003,
          thumbnail: THUMB_BOTANY,
          content_counts: { folders: { total: 12, direct: 12 }, video: { paid: 45, free: 6 }, pdf: { paid: 50, free: 8 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `b250_full`,
        title: 'NEET UG Full Syllabus All India Rank Tests (720M)',
        data: {
          id: 25004,
          thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/3347885_131_NEET%20AITS%20%281%29.png',
          content_counts: { folders: { total: 8, direct: 8 }, video: { paid: 30, free: 4 }, pdf: { paid: 35, free: 6 } }
        }
      }
    ];
  }

  if (bId === 152 || bId === 184) {
    // Drona NEET 11th & 2.0 NEET
    const prefix = bId === 184 ? 'b184' : 'b152';
    const tag = bId === 184 ? '2.0' : '1.0';
    return [
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `${prefix}_phy`,
        title: `Physics (भौतिक विज्ञान) - NEET ${tag}`,
        data: {
          id: Number(`${bId}01`),
          thumbnail: THUMB_PHYSICS,
          content_counts: { folders: { total: 15, direct: 15 }, video: { paid: 210, free: 15 }, pdf: { paid: 230, free: 25 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `${prefix}_chem`,
        title: `Chemistry (रसायन विज्ञान - Organic, Inorganic, Physical) - NEET ${tag}`,
        data: {
          id: Number(`${bId}02`),
          thumbnail: THUMB_CHEMISTRY,
          content_counts: { folders: { total: 18, direct: 18 }, video: { paid: 240, free: 20 }, pdf: { paid: 260, free: 30 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `${prefix}_bot`,
        title: `Botany (वनस्पति विज्ञान) - Complete NCERT In-Depth`,
        data: {
          id: Number(`${bId}03`),
          thumbnail: THUMB_BOTANY,
          content_counts: { folders: { total: 14, direct: 14 }, video: { paid: 180, free: 14 }, pdf: { paid: 195, free: 20 } }
        }
      },
      {
        type: 'folder',
        course_id: cId,
        parent_id: 0,
        entity_id: `${prefix}_zoo`,
        title: `Zoology (प्राणी विज्ञान) - Complete NCERT Mastery`,
        data: {
          id: Number(`${bId}04`),
          thumbnail: THUMB_ZOOLOGY,
          content_counts: { folders: { total: 14, direct: 14 }, video: { paid: 175, free: 12 }, pdf: { paid: 190, free: 20 } }
        }
      }
    ];
  }

  // Drona JEE 11th & 2.0 JEE (ID 151 & 185)
  const prefix = bId === 185 ? 'b185' : 'b151';
  const tag = bId === 185 ? '2.0' : '1.0';
  return [
    {
      type: 'folder',
      course_id: cId,
      parent_id: 0,
      entity_id: `${prefix}_phy`,
      title: `Physics (भौतिक विज्ञान) - JEE Main & Advanced ${tag}`,
      data: {
        id: Number(`${bId}01`),
        thumbnail: THUMB_PHYSICS,
        content_counts: { folders: { total: 16, direct: 16 }, video: { paid: 240, free: 18 }, pdf: { paid: 265, free: 30 } }
      }
    },
    {
      type: 'folder',
      course_id: cId,
      parent_id: 0,
      entity_id: `${prefix}_chem`,
      title: `Chemistry (Physical, Inorganic & Organic) - JEE ${tag}`,
      data: {
        id: Number(`${bId}02`),
        thumbnail: THUMB_CHEMISTRY,
        content_counts: { folders: { total: 18, direct: 18 }, video: { paid: 250, free: 20 }, pdf: { paid: 270, free: 35 } }
      }
    },
    {
      type: 'folder',
      course_id: cId,
      parent_id: 0,
      entity_id: `${prefix}_math`,
      title: `Mathematics (गणित) - JEE Main & Advanced ${tag}`,
      data: {
        id: Number(`${bId}03`),
        thumbnail: THUMB_MATHS,
        content_counts: { folders: { total: 18, direct: 18 }, video: { paid: 260, free: 22 }, pdf: { paid: 285, free: 32 } }
      }
    }
  ];
}

// Helper to build Chapters for a subject folder
export function getSubjectChapters(courseId: string | number, folderId: string): ContentItem[] {
  const cId = String(courseId);
  const fid = String(folderId);

  // Chapters list generator
  const createChapters = (chapList: Array<{ title: string; videos: number; pdfs: number }>) => {
    return chapList.map((chap, idx) => ({
      type: 'folder' as const,
      course_id: cId,
      parent_id: 1,
      entity_id: `${fid}_ch${idx + 1}`,
      title: `Ch ${(idx + 1).toString().padStart(2, '0')}: ${chap.title}`,
      data: {
        id: Math.abs(hashCode(`${fid}_ch${idx + 1}`)),
        thumbnail: fid.includes('phy') ? THUMB_PHYSICS : fid.includes('chem') ? THUMB_CHEMISTRY : fid.includes('math') ? THUMB_MATHS : fid.includes('bot') ? THUMB_BOTANY : fid.includes('zoo') ? THUMB_ZOOLOGY : THUMB_DEFAULT,
        content_counts: {
          folders: { total: 0, direct: 0 },
          video: { paid: chap.videos, free: 1 },
          pdf: { paid: chap.pdfs, free: 2 }
        }
      }
    }));
  };

  if (fid.includes('_phy')) {
    if (cId === '190') {
      return createChapters([
        { title: 'Electric Charges and Fields (विद्युत आवेश एवं क्षेत्र)', videos: 9, pdfs: 8 },
        { title: 'Electrostatic Potential and Capacitance (स्थिरवैद्युत विभव एवं धारिता)', videos: 8, pdfs: 7 },
        { title: 'Current Electricity (विद्युत धारा)', videos: 10, pdfs: 9 },
        { title: 'Moving Charges and Magnetism (गतिमान आवेश एवं चुंबकत्व)', videos: 8, pdfs: 7 },
        { title: 'Magnetism and Matter (चुंबकत्व एवं द्रव्य)', videos: 6, pdfs: 5 },
        { title: 'Electromagnetic Induction (विद्युतचुंबकीय प्रेरण)', videos: 7, pdfs: 7 },
        { title: 'Alternating Current (प्रत्यावर्ती धारा)', videos: 7, pdfs: 6 },
        { title: 'Electromagnetic Waves (विद्युतचुंबकीय तरंगें)', videos: 4, pdfs: 4 },
        { title: 'Ray Optics and Optical Instruments (किरण प्रकाशिकी)', videos: 12, pdfs: 10 },
        { title: 'Wave Optics (तरंग प्रकाशिकी)', videos: 8, pdfs: 7 },
        { title: 'Dual Nature of Radiation and Matter (विकिरण तथा द्रव्य की द्वैत प्रकृति)', videos: 6, pdfs: 5 },
        { title: 'Atoms & Nuclei (परमाणु एवं नाभिक)', videos: 7, pdfs: 6 },
        { title: 'Semiconductor Electronics (अर्धचालक इलेक्ट्रॉनिकी)', videos: 9, pdfs: 8 }
      ]);
    } else {
      // 11th Physics (JEE / NEET)
      return createChapters([
        { title: 'Units & Measurements (मात्रक एवं मापन)', videos: 6, pdfs: 6 },
        { title: 'Mathematical Tools & Vectors (वेक्टर्स एवं अवकलन-समाकलन)', videos: 8, pdfs: 7 },
        { title: 'Motion in a Straight Line (सरल रेखा में गति - 1D)', videos: 9, pdfs: 8 },
        { title: 'Motion in a Plane & Projectile (समतल में गति एवं प्रक्षेप्य - 2D)', videos: 10, pdfs: 9 },
        { title: 'Newton Laws of Motion (न्यूटन के गति के नियम - NLM)', videos: 12, pdfs: 10 },
        { title: 'Friction Dynamics (घर्षण)', videos: 6, pdfs: 5 },
        { title: 'Work, Energy & Power (कार्य, ऊर्जा एवं शक्ति - WEP)', videos: 10, pdfs: 9 },
        { title: 'Circular Motion (वृत्तीय गति)', videos: 7, pdfs: 6 },
        { title: 'Center of Mass & Collisions (द्रव्यमान केंद्र एवं संघट्ट)', videos: 9, pdfs: 8 },
        { title: 'Rotational Motion (घूर्णन गति - Rigid Body Dynamics)', videos: 14, pdfs: 12 },
        { title: 'Gravitation (गुरुत्वाकर्षण)', videos: 7, pdfs: 6 },
        { title: 'Mechanical Properties of Solids & Fluids (ठोस एवं तरल यांत्रिकी)', videos: 11, pdfs: 10 },
        { title: 'Thermal Physics & Thermodynamics (ऊष्मागतिकी)', videos: 11, pdfs: 9 },
        { title: 'Oscillations & SHM (सरल आवर्त गति)', videos: 8, pdfs: 7 },
        { title: 'Wave Motion & Sound Waves (तरंगें एवं ध्वनि)', videos: 9, pdfs: 8 }
      ]);
    }
  }

  if (fid.includes('_chem')) {
    if (cId === '190') {
      return createChapters([
        { title: 'Solutions (विलयन)', videos: 8, pdfs: 7 },
        { title: 'Electrochemistry (वैद्युतरसायन)', videos: 9, pdfs: 8 },
        { title: 'Chemical Kinetics (रासायनिक बलगतिकी)', videos: 8, pdfs: 7 },
        { title: 'd and f Block Elements (d एवं f ब्लॉक के तत्व)', videos: 7, pdfs: 6 },
        { title: 'Coordination Compounds (उपसहसंयोजन यौगिक)', videos: 9, pdfs: 8 },
        { title: 'Haloalkanes and Haloarenes (हैलोऐल्केन तथा हैलोऐरीन)', videos: 10, pdfs: 9 },
        { title: 'Alcohols, Phenols and Ethers (ऐल्कोहॉल, फीनॉल एवं ईथर)', videos: 10, pdfs: 9 },
        { title: 'Aldehydes, Ketones & Carboxylic Acids (ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल)', videos: 11, pdfs: 10 },
        { title: 'Amines (ऐमीन)', videos: 7, pdfs: 6 },
        { title: 'Biomolecules (जैव-अणु)', videos: 6, pdfs: 6 }
      ]);
    } else {
      return createChapters([
        { title: 'Some Basic Concepts of Chemistry - Mole Concept (मोल संकल्पना)', videos: 9, pdfs: 8 },
        { title: 'Structure of Atom (परमाणु की संरचना)', videos: 10, pdfs: 9 },
        { title: 'Classification of Elements & Periodicity (आवर्त सारणी)', videos: 7, pdfs: 6 },
        { title: 'Chemical Bonding & Molecular Structure (रासायनिक आबंधन)', videos: 13, pdfs: 11 },
        { title: 'Thermodynamics & Thermochemistry (ऊष्मागतिकी)', videos: 11, pdfs: 9 },
        { title: 'Chemical Equilibrium (रासायनिक साम्यावस्था)', videos: 8, pdfs: 7 },
        { title: 'Ionic Equilibrium (आयनिक साम्यावस्था)', videos: 10, pdfs: 9 },
        { title: 'Redox Reactions (अपचयोपचय अभिक्रियाएं)', videos: 6, pdfs: 5 },
        { title: 'Organic Chemistry - Some Basic Principles (GOC)', videos: 15, pdfs: 12 },
        { title: 'Hydrocarbons (हाइड्रोकार्बन - Alkane, Alkene, Alkyne, Aromatic)', videos: 12, pdfs: 10 }
      ]);
    }
  }

  if (fid.includes('_math')) {
    if (cId === '190') {
      return createChapters([
        { title: 'Relations and Functions (संबंध एवं फलन)', videos: 8, pdfs: 7 },
        { title: 'Inverse Trigonometric Functions (प्रतिलोम त्रिकोणमितीय फलन)', videos: 7, pdfs: 6 },
        { title: 'Matrices (आव्यूह)', videos: 8, pdfs: 7 },
        { title: 'Determinants (सारणिक)', videos: 7, pdfs: 7 },
        { title: 'Continuity and Differentiability (सांतत्य तथा अवकलनीयता)', videos: 10, pdfs: 9 },
        { title: 'Application of Derivatives - AOD (अवकलज के अनुप्रयोग)', videos: 9, pdfs: 8 },
        { title: 'Integrals - Indefinite & Definite (समाकलन)', videos: 14, pdfs: 12 },
        { title: 'Application of Integrals - Area (समाकलनों के अनुप्रयोग)', videos: 6, pdfs: 5 },
        { title: 'Differential Equations (अवकल समीकरण)', videos: 8, pdfs: 7 },
        { title: 'Vector Algebra (सदिश बीजगणित)', videos: 8, pdfs: 7 },
        { title: 'Three Dimensional Geometry - 3D (त्रि-विमीय ज्यामिति)', videos: 9, pdfs: 8 },
        { title: 'Linear Programming (रैखिक प्रोग्रामन)', videos: 5, pdfs: 5 },
        { title: 'Probability (प्रायिकता)', videos: 8, pdfs: 7 }
      ]);
    } else {
      return createChapters([
        { title: 'Sets, Relations & Functions (समुच्चय, संबंध एवं फलन)', videos: 8, pdfs: 7 },
        { title: 'Trigonometric Functions & Identities (त्रिकोणमितीय फलन)', videos: 11, pdfs: 10 },
        { title: 'Quadratic Equations & Expressions (द्विघात समीकरण)', videos: 9, pdfs: 8 },
        { title: 'Complex Numbers (सम्मिश्र संख्याएं)', videos: 10, pdfs: 9 },
        { title: 'Linear Inequalities (रैखिक असमिकाएं)', videos: 5, pdfs: 4 },
        { title: 'Permutations and Combinations (क्रमचय और संचय - P&C)', videos: 11, pdfs: 10 },
        { title: 'Binomial Theorem (द्विपद प्रमेय)', videos: 8, pdfs: 7 },
        { title: 'Sequences and Series - AP, GP, HP, AGP (अनुक्रम तथा श्रेणी)', videos: 9, pdfs: 8 },
        { title: 'Straight Lines & Pair of Lines (सरल रेखाएं)', videos: 10, pdfs: 9 },
        { title: 'Conic Sections - Circle, Parabola, Ellipse, Hyperbola (शंकु परिच्छेद)', videos: 16, pdfs: 14 },
        { title: 'Limits and Derivatives (सीमा और अवकलज)', videos: 10, pdfs: 9 },
        { title: 'Statistics & Probability (सांख्यिकी एवं प्रायिकता)', videos: 7, pdfs: 6 }
      ]);
    }
  }

  if (fid.includes('_bot')) {
    return createChapters([
      { title: 'Cell: The Unit of Life (कोशिका: जीवन की इकाई)', videos: 9, pdfs: 8 },
      { title: 'Cell Cycle and Cell Division (कोशिका चक्र एवं विभाजन)', videos: 6, pdfs: 6 },
      { title: 'The Living World (जीव जगत)', videos: 5, pdfs: 5 },
      { title: 'Biological Classification (जीव जगत का वर्गीकरण)', videos: 8, pdfs: 7 },
      { title: 'Plant Kingdom (पादप जगत)', videos: 9, pdfs: 8 },
      { title: 'Morphology of Flowering Plants (पुष्पी पादपों की आकारिकी)', videos: 9, pdfs: 8 },
      { title: 'Anatomy of Flowering Plants (पुष्पी पादपों की शारीरिकी)', videos: 8, pdfs: 7 },
      { title: 'Photosynthesis in Higher Plants (उच्च पादपों में प्रकाश-संश्लेषण)', videos: 10, pdfs: 9 },
      { title: 'Respiration in Plants (पादपों में श्वसन)', videos: 7, pdfs: 6 },
      { title: 'Plant Growth and Development (पादप वृद्धि एवं परिवर्धन)', videos: 6, pdfs: 5 }
    ]);
  }

  if (fid.includes('_zoo') || fid.includes('_bio')) {
    return createChapters([
      { title: 'Animal Kingdom (प्राणी जगत - Non-Chordata & Chordata)', videos: 11, pdfs: 10 },
      { title: 'Structural Organisation in Animals & Tissues (जंतुओं में संरचनात्मक संगठन)', videos: 7, pdfs: 6 },
      { title: 'Biomolecules (जैव अणु - Proteins, Carbohydrates, Lipids, Nucleic Acids)', videos: 8, pdfs: 7 },
      { title: 'Breathing and Exchange of Gases (श्वसन और गैसों का विनिमय)', videos: 7, pdfs: 6 },
      { title: 'Body Fluids and Circulation (शरीर द्रव तथा परिसंचरण)', videos: 8, pdfs: 7 },
      { title: 'Excretory Products and Their Elimination (उत्सर्जी उत्पाद एवं निष्कासन)', videos: 7, pdfs: 6 },
      { title: 'Locomotion and Movement (गमन एवं संचलन)', videos: 6, pdfs: 6 },
      { title: 'Neural Control and Coordination (तंत्रिकीय नियंत्रण एवं समन्वय)', videos: 9, pdfs: 8 },
      { title: 'Chemical Coordination and Integration (रासायनिक समन्वय तथा एकीकरण)', videos: 8, pdfs: 7 }
    ]);
  }

  if (fid.includes('_sci')) {
    // 10th Science
    return createChapters([
      { title: 'Chemical Reactions and Equations (रासायनिक अभिक्रियाएं एवं समीकरण)', videos: 7, pdfs: 6 },
      { title: 'Acids, Bases and Salts (अम्ल, क्षारक एवं लवण)', videos: 8, pdfs: 7 },
      { title: 'Metals and Non-Metals (धातु एवं अधातु)', videos: 8, pdfs: 7 },
      { title: 'Carbon and its Compounds (कार्बन एवं उसके यौगिक)', videos: 9, pdfs: 8 },
      { title: 'Life Processes (जैव प्रक्रम - Nutrition, Respiration, Transport, Excretion)', videos: 11, pdfs: 10 },
      { title: 'Control and Coordination (नियंत्रण एवं समन्वय)', videos: 7, pdfs: 6 },
      { title: 'How do Organisms Reproduce? (जीव जनन कैसे करते हैं?)', videos: 8, pdfs: 7 },
      { title: 'Heredity (आनुवंशिकता)', videos: 6, pdfs: 5 },
      { title: 'Light - Reflection and Refraction (प्रकाश - परावर्तन तथा अपवर्तन)', videos: 10, pdfs: 9 },
      { title: 'The Human Eye and Colourful World (मानव नेत्र तथा रंगबिरंगा संसार)', videos: 6, pdfs: 5 },
      { title: 'Electricity (विद्युत)', videos: 9, pdfs: 8 },
      { title: 'Magnetic Effects of Electric Current (विद्युत धारा के चुंबकीय प्रभाव)', videos: 8, pdfs: 7 },
      { title: 'Our Environment (हमारा पर्यावरण)', videos: 5, pdfs: 5 }
    ]);
  }

  if (fid.includes('_full')) {
    return createChapters([
      { title: 'AITS Full Mock Test 01 - Complete Class 11th Syllabus', videos: 4, pdfs: 4 },
      { title: 'AITS Full Mock Test 02 - High-Yield Rank Booster Paper', videos: 4, pdfs: 4 },
      { title: 'AITS Full Mock Test 03 - Kota Elite Benchmark Test', videos: 4, pdfs: 4 },
      { title: 'AITS Full Mock Test 04 - Speed & Accuracy Challenger', videos: 4, pdfs: 4 },
      { title: 'AITS Full Mock Test 05 - Final All India Simulation Exam', videos: 4, pdfs: 4 },
    ]);
  }

  // Fallback generic chapters
  return createChapters([
    { title: 'Chapter 01: Core Fundamental Concepts & Theories', videos: 7, pdfs: 6 },
    { title: 'Chapter 02: Advanced Principles & Derivations', videos: 8, pdfs: 7 },
    { title: 'Chapter 03: Kota Classroom Problem Solving Masterclass', videos: 9, pdfs: 8 },
    { title: 'Chapter 04: Previous Year Questions (PYQs) & Speed Tricks', videos: 8, pdfs: 7 },
    { title: 'Chapter 05: High-Yield Revision & Mock Test Discussion', videos: 6, pdfs: 6 }
  ]);
}

// Helper to generate full Recorded Lectures and PDFs inside a chapter folder
export function getChapterContent(courseId: string | number, chapterId: string, chapterTitle: string): ContentItem[] {
  const cId = String(courseId);
  const items: ContentItem[] = [];

  // Extract clean chapter name without "Ch XX: "
  const cleanTitle = chapterTitle.replace(/^Ch\s*\d+:\s*/i, '').trim();

  // Faculty mapping
  let faculty = 'Kota Senior Faculty';
  let thumb = THUMB_DEFAULT;
  if (chapterId.includes('_phy')) {
    faculty = 'Kota Physics Master (Shobhit Bhaiya & Team)';
    thumb = THUMB_PHYSICS;
  } else if (chapterId.includes('_chem')) {
    faculty = 'Kota Chemistry HOD';
    thumb = THUMB_CHEMISTRY;
  } else if (chapterId.includes('_math')) {
    faculty = 'Kota Mathematics Guru';
    thumb = THUMB_MATHS;
  } else if (chapterId.includes('_bot')) {
    faculty = 'Senior NEET Botany Specialist';
    thumb = THUMB_BOTANY;
  } else if (chapterId.includes('_zoo') || chapterId.includes('_bio')) {
    faculty = 'Dr. Sharma (Kota Zoology Master)';
    thumb = THUMB_ZOOLOGY;
  }

  // 1. Video Lectures (5 to 7 detailed lectures per chapter)
  const lectureTopics = [
    { num: '01', sub: 'Introduction, Fundamental Definitions & Basic Concepts', dur: 4120, timeStr: '1h 08m' },
    { num: '02', sub: 'In-Depth Theory, Formulas & Essential Derivations', dur: 4450, timeStr: '1h 14m' },
    { num: '03', sub: 'Kota Sheet Level-1 Problem Solving & Numerical Tricks', dur: 3980, timeStr: '1h 06m' },
    { num: '04', sub: 'Advanced Concepts, Tricky Cases & Shortcuts', dur: 4620, timeStr: '1h 17m' },
    { num: '05', sub: 'Previous Years Questions (PYQs) 2018-2026 Discussion', dur: 4320, timeStr: '1h 12m' },
    { num: '06', sub: 'Complete One-Shot Rapid Revision & Formula Recap', dur: 3750, timeStr: '1h 02m' },
  ];

  lectureTopics.forEach((lt, idx) => {
    const vidId = Math.abs(hashCode(`${chapterId}_lec_${idx + 1}`));
    const videoUrl = LECTURE_VIDEO_URLS[idx % LECTURE_VIDEO_URLS.length];
    const lecTitle = `${cleanTitle} | L - ${lt.num} (${lt.sub})`;

    // Register media resolver
    registerMedia(cId, vidId, {
      title: lecTitle,
      description: `Lecture ${lt.num} for ${cleanTitle}. Taught by ${faculty}. Includes complete theory, classroom illustrations, and shortcut methods.`,
      thumbnail: thumb,
      file_url: videoUrl,
      file_type: 2,
      video_type: 4,
      duration: lt.dur,
      download_urls: [
        { title: '720', url: videoUrl },
        { title: '480', url: videoUrl },
        { title: '360', url: videoUrl }
      ]
    });

    items.push({
      type: 'file',
      course_id: cId,
      parent_id: Math.abs(hashCode(chapterId)),
      entity_id: String(vidId),
      title: lecTitle,
      data: {
        id: vidId,
        title: lecTitle,
        file_url: videoUrl,
        thumbnail: thumb,
        file_type: 2, // Video
        video_type: 4, // HLS / MP4
        duration: lt.dur,
        created_at: Math.floor(Date.now() / 1000) - (6 - idx) * 86400,
        description: `Faculty: ${faculty} • Duration: ${lt.timeStr} • Full HD 1080p`,
        download_urls: [
          { title: '720p', url: videoUrl },
          { title: '480p', url: videoUrl },
          { title: '360p', url: videoUrl }
        ]
      }
    });
  });

  // 2. PDFs & Notes (Class notes, DPPs, Solutions, Formula sheet)
  const pdfDocs = [
    {
      title: `Class Handwritten Notes - ${cleanTitle} (Full Kota Faculty Notes)`,
      pages: '48 Pages',
      size: '8.4 MB',
      type: 'Handwritten Notes',
      url: LECTURE_PDF_URLS[0]
    },
    {
      title: `DPP 01: Daily Practice Problems - Basic to Moderate Level`,
      pages: '12 Pages',
      size: '2.1 MB',
      type: 'DPP Sheet',
      url: LECTURE_PDF_URLS[1]
    },
    {
      title: `DPP 02: Advanced Level Questions with Detailed Step-by-Step Solutions`,
      pages: '18 Pages',
      size: '3.5 MB',
      type: 'DPP Solution',
      url: LECTURE_PDF_URLS[2]
    },
    {
      title: `Formula Handbook, Mindmap & Short Revision Sheet - ${cleanTitle}`,
      pages: '4 Pages',
      size: '1.2 MB',
      type: 'Formula Sheet',
      url: LECTURE_PDF_URLS[3]
    },
    {
      title: `NCERT Line-by-Line Highlighted & PYQ Marked PDF`,
      pages: '26 Pages',
      size: '5.8 MB',
      type: 'NCERT Booster',
      url: LECTURE_PDF_URLS[4]
    }
  ];

  pdfDocs.forEach((doc, idx) => {
    const pdfId = Math.abs(hashCode(`${chapterId}_pdf_${idx + 1}`));
    registerMedia(cId, pdfId, {
      title: doc.title,
      description: `${doc.type} for ${cleanTitle}. ${doc.pages} • High Resolution PDF.`,
      thumbnail: thumb,
      file_url: doc.url,
      file_type: 1, // PDF
      download_urls: [{ title: 'PDF', url: doc.url }]
    });

    items.push({
      type: 'file',
      course_id: cId,
      parent_id: Math.abs(hashCode(chapterId)),
      entity_id: String(pdfId),
      title: doc.title,
      data: {
        id: pdfId,
        title: doc.title,
        file_url: doc.url,
        thumbnail: thumb,
        file_type: 1, // PDF
        description: `${doc.type} • ${doc.pages} • ${doc.size} • PDF Document`,
        download_urls: [{ title: 'Download PDF', url: doc.url }]
      }
    });
  });

  return items;
}

// Master fallback router for getFolderContent
export function getFallbackFolderContent(courseId: number | string, folderId: string | number = '0'): ContentItem[] {
  const fid = String(folderId);

  // Level 0: Course Content Root -> Return Subjects
  if (fid === '0' || fid === 'root') {
    return getBatchSubjects(courseId);
  }

  // Level 1: Subject Folder -> Return Chapters
  if (fid.includes('_phy') || fid.includes('_chem') || fid.includes('_math') || fid.includes('_bot') || fid.includes('_zoo') || fid.includes('_sci') || fid.includes('_sst') || fid.includes('_hindi') || fid.includes('_eng') || fid.includes('_bio')) {
    // If it does not contain "_ch", it's a subject folder!
    if (!fid.includes('_ch')) {
      return getSubjectChapters(courseId, fid);
    }
  }

  // Level 2: Chapter Folder -> Return Video Lectures & PDFs
  if (fid.includes('_ch')) {
    // Look up chapter title if possible
    const subjectPrefix = fid.split('_ch')[0];
    const chaps = getSubjectChapters(courseId, subjectPrefix);
    const found = chaps.find(c => c.entity_id === fid);
    const title = found?.title || 'Chapter Content';
    return getChapterContent(courseId, fid, title);
  }

  // Fallback: return subjects
  return getBatchSubjects(courseId);
}

// Complete Live Classes schedule (LIVE NOW, UPCOMING, COMPLETED/RECORDED)
export function getFallbackLiveClasses(
  courseId: number | string,
  tabType: 'LIVE' | 'UPCOMING' | 'COMPLETED'
): LiveClassItem[] {
  const bId = Number(courseId);
  const now = Math.floor(Date.now() / 1000);
  const isNeet = bId === 152 || bId === 184;
  const is10th = bId === 191;
  const is12th = bId === 190;

  // 1. 🔴 LIVE NOW TAB
  if (tabType === 'LIVE') {
    const liveItemsList: LiveClassItem[] = [];

    // Check if user or Sir configured a real live link in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedCustom = localStorage.getItem(`gbstudy_custom_live_${bId}`) || localStorage.getItem('gbstudy_custom_live_global');
        if (savedCustom) {
          const parsed = JSON.parse(savedCustom);
          if (parsed && parsed.url && parsed.url.trim() !== '') {
            const customLiveId = Math.abs(hashCode(`custom_live_${bId}_${parsed.url}`));
            const isYt = parsed.url.includes('youtube.com') || parsed.url.includes('youtu.be');
            registerMedia(courseId, customLiveId, {
              title: parsed.title || '🔴 Live Class by Sir',
              description: parsed.description || 'Sir is streaming this live class right now.',
              thumbnail: parsed.thumbnail || THUMB_DEFAULT,
              file_url: parsed.url,
              file_type: 2,
              video_type: isYt ? 1 : 4,
              is_live: 1,
              duration: 7200,
            });

            liveItemsList.push({
              id: customLiveId,
              video_id: customLiveId,
              title: `🔥 [LIVE ON-AIR BY SIR] ${parsed.title || 'Live Class in Session'}`,
              description: parsed.description || 'Sir is currently live taking this class. Click below to enter the live room immediately.',
              thumbnail: parsed.thumbnail || THUMB_DEFAULT,
              live_from: now - 900,
              live_status: 1,
              is_live: 1,
              subject: parsed.subject || 'Core Subject',
              instructor: parsed.instructor || 'Sir (GB Study Kota Lead)',
              course: { title: `GB Study Batch ${courseId}` },
              file_url: parsed.url,
            });
          }
        }
      } catch {}
    }

    // Real Live Classes per Batch
    if (is10th) {
      // Class 10th Real Live Classes
      const live10Id1 = Math.abs(hashCode(`live_10_sci_${bId}`));
      const stream10_1 = 'https://www.youtube.com/watch?v=0k2xQ0uR0mQ';
      registerMedia(courseId, live10Id1, {
        title: '🔴 [LIVE NOW] Class 10th Science: Chemical Reactions & Equations Complete Board Revision',
        description: 'Class 10th Science Board live session by Shobhit Bhaiya & Kota Mentors. Live problem solving & question discussion.',
        thumbnail: THUMB_PHYSICS,
        file_url: stream10_1,
        file_type: 2,
        video_type: 1,
        is_live: 1,
        duration: 5400,
      });

      const live10Id2 = Math.abs(hashCode(`live_10_math_${bId}`));
      const stream10_2 = 'https://www.youtube.com/watch?v=8mvykP8iJ_4';
      registerMedia(courseId, live10Id2, {
        title: '🔴 [LIVE NOW] Class 10th Mathematics: Real Numbers & Polynomials Board High-Yield MCQs',
        description: 'Interactive live session with live student doubts and step-by-step NCERT solutions.',
        thumbnail: THUMB_MATHS,
        file_url: stream10_2,
        file_type: 2,
        video_type: 1,
        is_live: 1,
        duration: 5400,
      });

      liveItemsList.push(
        {
          id: live10Id1,
          video_id: live10Id1,
          title: '🔴 [LIVE NOW] Class 10th Science: Chemical Reactions & Equations Board Revision',
          description: 'Class 10th Science Live Session with Shobhit Bhaiya. High-yield board questions & live doubts.',
          thumbnail: THUMB_PHYSICS,
          live_from: now - 1800,
          live_status: 1,
          is_live: 1,
          subject: 'Science (Chemistry)',
          instructor: 'Shobhit Bhaiya & Kota Team',
          course: { title: 'टॉपर बैच - Class 10th' },
          file_url: stream10_1,
        },
        {
          id: live10Id2,
          video_id: live10Id2,
          title: '🔴 [LIVE NOW] Class 10th Mathematics: Real Numbers & Board Pattern PYQs Live',
          description: 'Live interactive class covering 10th board paper trends, 5-markers, and concept tricks.',
          thumbnail: THUMB_MATHS,
          live_from: now - 1200,
          live_status: 1,
          is_live: 1,
          subject: 'Mathematics',
          instructor: 'Kota Maths HOD',
          course: { title: 'टॉपर बैच - Class 10th' },
          file_url: stream10_2,
        }
      );
    } else if (is12th) {
      // Class 12th Science Real Live Classes
      const live12Id1 = Math.abs(hashCode(`live_12_phy_${bId}`));
      const stream12_1 = 'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4767844/1779196053_4502928520893716/177919292394489029618_720';
      registerMedia(courseId, live12Id1, {
        title: '🔴 [LIVE NOW] 12th Physics: Electrostatics, Gauss Law & Electric Field Derivations Live Class',
        description: 'Complete 12th Board Science live lecture with Kota Physics HOD. Detailed derivations and numerical shortcuts.',
        thumbnail: THUMB_PHYSICS,
        file_url: stream12_1,
        file_type: 2,
        video_type: 4,
        is_live: 1,
        duration: 6264,
      });

      const live12Id2 = Math.abs(hashCode(`live_12_chem_${bId}`));
      const stream12_2 = 'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4768824/1779282902_8151791412742851/177927979185549029618_720';
      registerMedia(courseId, live12Id2, {
        title: '🔴 [LIVE NOW] 12th Chemistry: Solutions, Raoult\'s Law & Colligative Properties Live Session',
        description: 'Live Kota classroom problem solving on solutions, molarity, and board numerical patterns.',
        thumbnail: THUMB_CHEMISTRY,
        file_url: stream12_2,
        file_type: 2,
        video_type: 4,
        is_live: 1,
        duration: 6720,
      });

      liveItemsList.push(
        {
          id: live12Id1,
          video_id: live12Id1,
          title: '🔴 [LIVE NOW] 12th Physics: Electrostatics & Gauss Law Derivations Live Class',
          description: 'Classroom live session by Kota Senior Faculty. Essential 5-mark derivations and numericals.',
          thumbnail: THUMB_PHYSICS,
          live_from: now - 2100,
          live_status: 1,
          is_live: 1,
          subject: 'Physics',
          instructor: 'Kota Physics HOD',
          course: { title: 'वरदान बैच - 12th Science' },
          file_url: stream12_1,
        },
        {
          id: live12Id2,
          video_id: live12Id2,
          title: '🔴 [LIVE NOW] 12th Chemistry: Solutions & Colligative Properties Numericals',
          description: 'In-depth problem solving with live doubt clearing. NCERT + Board focus.',
          thumbnail: THUMB_CHEMISTRY,
          live_from: now - 1500,
          live_status: 1,
          is_live: 1,
          subject: 'Chemistry',
          instructor: 'Senior Chemistry Faculty',
          course: { title: 'वरदान बैच - 12th Science' },
          file_url: stream12_2,
        }
      );
    } else if (isNeet) {
      // NEET Real Live Classes
      const liveNeetId1 = Math.abs(hashCode(`live_neet_bot_${bId}`));
      const streamNeet_1 = 'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4769737/1779369850_5220160857741270/177936597653179029618_720';
      registerMedia(courseId, liveNeetId1, {
        title: '🔴 [LIVE NOW] NEET 2027: Cell Biology & Plant Physiology Complete NCERT Mastery Live',
        description: 'Kota NEET Botany Masterclass. In-depth NCERT line-by-line coverage and PYQs.',
        thumbnail: THUMB_BOTANY,
        file_url: streamNeet_1,
        file_type: 2,
        video_type: 4,
        is_live: 1,
        duration: 6311,
      });

      const liveNeetId2 = Math.abs(hashCode(`live_neet_phy_${bId}`));
      const streamNeet_2 = 'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4767844/1779196053_4502928520893716/177919292394489029618_720';
      registerMedia(courseId, liveNeetId2, {
        title: '🔴 [LIVE NOW] NEET Physics: Mechanics, Vectors & Friction High-Speed Problem Solving',
        description: 'Kota Senior Physics Faculty live lecture. Shortcut calculation tricks for NEET.',
        thumbnail: THUMB_PHYSICS,
        file_url: streamNeet_2,
        file_type: 2,
        video_type: 4,
        is_live: 1,
        duration: 6264,
      });

      liveItemsList.push(
        {
          id: liveNeetId1,
          video_id: liveNeetId1,
          title: '🔴 [LIVE NOW] NEET 2027: Cell Biology & Plant Physiology Complete NCERT In-Depth Live',
          description: 'NCERT line-by-line concept breakdown by Senior NEET Specialist. Real-time doubt resolution.',
          thumbnail: THUMB_BOTANY,
          live_from: now - 2400,
          live_status: 1,
          is_live: 1,
          subject: 'Botany & Zoology',
          instructor: 'Dr. Sharma & Kota NEET Team',
          course: { title: `Drona NEET ${bId === 184 ? '2.0' : '1.0'}` },
          file_url: streamNeet_1,
        },
        {
          id: liveNeetId2,
          video_id: liveNeetId2,
          title: '🔴 [LIVE NOW] NEET Physics: Vectors, 1D Motion & Friction High-Speed Shortcuts',
          description: 'Learn fast formula shortcuts and previous 10-year NEET question patterns.',
          thumbnail: THUMB_PHYSICS,
          live_from: now - 1200,
          live_status: 1,
          is_live: 1,
          subject: 'Physics',
          instructor: 'Rajan Sir & Kota Faculty',
          course: { title: `Drona NEET ${bId === 184 ? '2.0' : '1.0'}` },
          file_url: streamNeet_2,
        }
      );
    } else {
      // JEE Main & Advanced Real Live Classes
      const liveJeeId1 = Math.abs(hashCode(`live_jee_phy_${bId}`));
      const streamJee_1 = 'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4767844/1779196053_4502928520893716/177919292394489029618_720';
      registerMedia(courseId, liveJeeId1, {
        title: '🔴 [LIVE NOW] JEE Main & Adv: Vectors & 1D Kinematics Advanced Problem Solving - Rajan Sir',
        description: 'Kota Classroom Live Lecture by Rajan Sir. Advanced problem dissection, shortcut tricks and PYQs.',
        thumbnail: THUMB_PHYSICS,
        file_url: streamJee_1,
        file_type: 2,
        video_type: 4,
        is_live: 1,
        duration: 6264,
      });

      const liveJeeId2 = Math.abs(hashCode(`live_jee_math_${bId}`));
      const streamJee_2 = 'https://dulae92u7241v.cloudfront.net/file_library/videos/download/4772274/1779712153_2586305600258026/177971199032489029618_720';
      registerMedia(courseId, liveJeeId2, {
        title: '🔴 [LIVE NOW] JEE Mathematics: Calculus & Quadratic Equations Masterclass Live',
        description: 'Kota Maths HOD live lecture with multi-concept problems and graphical shortcut methods.',
        thumbnail: THUMB_MATHS,
        file_url: streamJee_2,
        file_type: 2,
        video_type: 4,
        is_live: 1,
        duration: 6955,
      });

      liveItemsList.push(
        {
          id: liveJeeId1,
          video_id: liveJeeId1,
          title: '🔴 [LIVE NOW] JEE Main & Adv: Vectors & Kinematics Problem Solving - Rajan Sir',
          description: 'Live Kota classroom lecture by Rajan Sir. Multi-concept problem solving with step-by-step shortcuts.',
          thumbnail: THUMB_PHYSICS,
          live_from: now - 2700,
          live_status: 1,
          is_live: 1,
          subject: 'Physics',
          instructor: 'Rajan Sir (NextToppers / Kota)',
          course: { title: `Drona JEE ${bId === 185 ? '2.0' : '1.0'}` },
          file_url: streamJee_1,
        },
        {
          id: liveJeeId2,
          video_id: liveJeeId2,
          title: '🔴 [LIVE NOW] JEE Mathematics: Advanced Algebra & Quadratic Equations Live',
          description: 'Master tricky JEE Advanced questions with graphical methods and speed techniques.',
          thumbnail: THUMB_MATHS,
          live_from: now - 1500,
          live_status: 1,
          is_live: 1,
          subject: 'Mathematics',
          instructor: 'Kota Mathematics Guru',
          course: { title: `Drona JEE ${bId === 185 ? '2.0' : '1.0'}` },
          file_url: streamJee_2,
        }
      );
    }

    return liveItemsList;
  }

  // 2. ⏳ UPCOMING TAB (Today's & Tomorrow's Live Timetable with Countdown)
  if (tabType === 'UPCOMING') {
    if (is10th) {
      return [
        {
          id: Math.abs(hashCode(`up_10_1_${bId}`)),
          video_id: Math.abs(hashCode(`up_10_1_${bId}`)),
          title: 'Class 10th Maths: Quadratic Equations Word Problems & Tricky Board Questions',
          description: 'Live interactive session on standard CBSE/State Board 5-marker problems.',
          thumbnail: THUMB_MATHS,
          live_from: now + 3600 * 2, // in 2 hours
          live_status: 0,
          subject: 'Mathematics',
          instructor: 'Kota Maths HOD',
          course: { title: 'टॉपर बैच - Class 10th' }
        },
        {
          id: Math.abs(hashCode(`up_10_2_${bId}`)),
          video_id: Math.abs(hashCode(`up_10_2_${bId}`)),
          title: 'Class 10th Science: Chemical Reactions & Balancing Equations Live Quiz & Doubts',
          description: 'Full reaction chart revision with live student polls.',
          thumbnail: THUMB_CHEMISTRY,
          live_from: now + 3600 * 5, // in 5 hours
          live_status: 0,
          subject: 'Science (Chemistry)',
          instructor: 'Kota Science Star',
          course: { title: 'टॉपर बैच - Class 10th' }
        },
        {
          id: Math.abs(hashCode(`up_10_3_${bId}`)),
          video_id: Math.abs(hashCode(`up_10_3_${bId}`)),
          title: 'Class 10th Social Science: The Rise of Nationalism in Europe Complete Map & PYQs',
          description: 'High scoring timeline analysis and expected 2027 board questions.',
          thumbnail: THUMB_DEFAULT,
          live_from: now + 3600 * 8, // in 8 hours
          live_status: 0,
          subject: 'Social Science',
          instructor: 'Senior SST Faculty',
          course: { title: 'टॉपर बैच - Class 10th' }
        }
      ];
    }

    if (is12th) {
      return [
        {
          id: Math.abs(hashCode(`up_12_1_${bId}`)),
          video_id: Math.abs(hashCode(`up_12_1_${bId}`)),
          title: '12th Physics Live: Gauss Law Applications & Dipole Electric Field Derivations',
          description: 'CBSE and State Board essential 5-mark derivations with live numerical practice.',
          thumbnail: THUMB_PHYSICS,
          live_from: now + 3600 * 2.5,
          live_status: 0,
          subject: 'Physics',
          instructor: 'Kota Physics HOD',
          course: { title: 'वरदान बैच - 12th Science' }
        },
        {
          id: Math.abs(hashCode(`up_12_2_${bId}`)),
          video_id: Math.abs(hashCode(`up_12_2_${bId}`)),
          title: '12th Chemistry Live: Solutions & Colligative Properties Numerical Shortcuts',
          description: 'Van\'t Hoff factor and depression in freezing point problems.',
          thumbnail: THUMB_CHEMISTRY,
          live_from: now + 3600 * 5.5,
          live_status: 0,
          subject: 'Chemistry',
          instructor: 'Senior Chemistry Faculty',
          course: { title: 'वरदान बैच - 12th Science' }
        },
        {
          id: Math.abs(hashCode(`up_12_3_${bId}`)),
          video_id: Math.abs(hashCode(`up_12_3_${bId}`)),
          title: '12th Mathematics Live: Matrices & Determinants Inverse Methods & Cramers Rule',
          description: 'Shortcut matrix inversion tricks for board and competitive exams.',
          thumbnail: THUMB_MATHS,
          live_from: now + 3600 * 8,
          live_status: 0,
          subject: 'Mathematics',
          instructor: 'Kota Maths Master',
          course: { title: 'वरदान बैच - 12th Science' }
        }
      ];
    }

    if (isNeet) {
      return [
        {
          id: Math.abs(hashCode(`up_neet_1_${bId}`)),
          video_id: Math.abs(hashCode(`up_neet_1_${bId}`)),
          title: 'Botany Live: Photosynthesis & Plant Physiology - In-Depth NCERT Discussion',
          description: 'Daily Live Kota faculty interactive class with live doubt clearing.',
          thumbnail: THUMB_BOTANY,
          live_from: now + 3600 * 2.5,
          live_status: 0,
          subject: 'Botany',
          instructor: 'Kota Expert Faculty',
          course: { title: `Drona NEET ${bId === 184 ? '2.0' : '1.0'}` }
        },
        {
          id: Math.abs(hashCode(`up_neet_2_${bId}`)),
          video_id: Math.abs(hashCode(`up_neet_2_${bId}`)),
          title: 'Zoology Live: Animal Kingdom & Human Physiology High-Yield Questions',
          description: 'Daily Live problem solving with real-time poll & student doubts.',
          thumbnail: THUMB_ZOOLOGY,
          live_from: now + 3600 * 5,
          live_status: 0,
          subject: 'Zoology',
          instructor: 'Senior NEET Mentor',
          course: { title: `Drona NEET ${bId === 184 ? '2.0' : '1.0'}` }
        },
        {
          id: Math.abs(hashCode(`up_neet_3_${bId}`)),
          video_id: Math.abs(hashCode(`up_neet_3_${bId}`)),
          title: 'NEET Physics Live: Laws of Motion & Friction Shortcut Tricks',
          description: 'Learn fast calculation methods and tricky NEET pattern MCQs.',
          thumbnail: THUMB_PHYSICS,
          live_from: now + 3600 * 7.5,
          live_status: 0,
          subject: 'Physics',
          instructor: 'Kota Physics Master',
          course: { title: `Drona NEET ${bId === 184 ? '2.0' : '1.0'}` }
        }
      ];
    }

    // JEE UPCOMING
    return [
      {
        id: Math.abs(hashCode(`up_jee_1_${bId}`)),
        video_id: Math.abs(hashCode(`up_jee_1_${bId}`)),
        title: 'JEE Physics Live: Work, Power & Energy - Advanced Multi-Concept Problems',
        description: 'Daily live lecture covering multi-concept JEE Advanced problems with live faculty guidance.',
        thumbnail: THUMB_PHYSICS,
        live_from: now + 3600 * 2.5,
        live_status: 0,
        subject: 'Physics',
        instructor: 'Kota Physics HOD',
        course: { title: `Drona JEE ${bId === 185 ? '2.0' : '1.0'}` }
      },
      {
        id: Math.abs(hashCode(`up_jee_2_${bId}`)),
        video_id: Math.abs(hashCode(`up_jee_2_${bId}`)),
        title: 'JEE Mathematics Live: Quadratic Equations & Complex Numbers Masterclass',
        description: 'Shortcut tips, graphical methods, and previous years question dissection.',
        thumbnail: THUMB_MATHS,
        live_from: now + 3600 * 5,
        live_status: 0,
        subject: 'Mathematics',
        instructor: 'Kota Maths Guru',
        course: { title: `Drona JEE ${bId === 185 ? '2.0' : '1.0'}` }
      },
      {
        id: Math.abs(hashCode(`up_jee_3_${bId}`)),
        video_id: Math.abs(hashCode(`up_jee_3_${bId}`)),
        title: 'JEE Chemistry Live: Chemical Bonding & Molecular Orbital Theory (MOT)',
        description: 'Live interactive doubt session with hybridization tricks and 3D visualization.',
        thumbnail: THUMB_CHEMISTRY,
        live_from: now + 3600 * 7.5,
        live_status: 0,
        subject: 'Chemistry',
        instructor: 'Kota Chemistry Star',
        course: { title: `Drona JEE ${bId === 185 ? '2.0' : '1.0'}` }
      }
    ];
  }

  // 3. 📼 COMPLETED / RECORDED LIVE CLASSES TAB (Rich Archive with Watch Recording & PDF buttons!)
  const completedList: LiveClassItem[] = [];

  const rawCompleted = [
    {
      title: is10th
        ? 'Class 10th Maths: Real Numbers & Euclid Division Lemma Masterclass'
        : is12th
        ? '12th Physics Live: Coulomb Law in Vector Form & Superposition Principle'
        : isNeet
        ? 'NEET Botany Live: Cell Organelles, Mitochondria & Chloroplast Deep Dive'
        : 'JEE Physics Live: Work-Energy Theorem in Non-Inertial Frames',
      subject: is10th ? 'Mathematics' : 'Physics',
      date: 'Yesterday, 6:00 PM',
      duration: '1h 22m',
      instructor: 'Shobhit Bhaiya & Kota HOD',
      thumb: is10th ? THUMB_MATHS : THUMB_PHYSICS
    },
    {
      title: is10th
        ? 'Class 10th Science: Chemical Equations, Balancing & Types of Reactions'
        : is12th
        ? '12th Chemistry Live: Raoult Law, Ideal & Non-Ideal Solutions Detailed Derivation'
        : isNeet
        ? 'NEET Zoology Live: Epithelial & Connective Tissues High Yield PYQs'
        : 'JEE Maths Live: Roots of Unity, De Moivre Theorem & Geometry in Complex Numbers',
      subject: is10th ? 'Science' : is12th ? 'Chemistry' : isNeet ? 'Zoology' : 'Mathematics',
      date: '17 Oct 2026, 4:00 PM',
      duration: '1h 15m',
      instructor: 'Senior Kota Specialist',
      thumb: is10th ? THUMB_CHEMISTRY : is12th ? THUMB_CHEMISTRY : isNeet ? THUMB_ZOOLOGY : THUMB_MATHS
    },
    {
      title: is10th
        ? 'Class 10th Social Science: Federalism - Key Features & Decentralisation in India'
        : is12th
        ? '12th Maths Live: Relations, Equivalence Relations & Bijective Functions'
        : isNeet
        ? 'NEET Chemistry Live: Quantum Numbers, Aufbau Principle & Electronic Configurations'
        : 'JEE Chemistry Live: VSEPR Theory, Molecular Geometry & Dipole Moment Problems',
      subject: is10th ? 'Social Science' : is12th ? 'Mathematics' : 'Chemistry',
      date: '16 Oct 2026, 7:30 PM',
      duration: '1h 30m',
      instructor: 'Kota Master Faculty',
      thumb: is10th ? THUMB_DEFAULT : is12th ? THUMB_MATHS : THUMB_CHEMISTRY
    },
    {
      title: is10th
        ? 'Class 10th Science: Life Processes - Autotrophic & Heterotrophic Nutrition'
        : is12th
        ? '12th Biology Live: Sexual Reproduction in Flowering Plants & Pollination'
        : isNeet
        ? 'NEET Physics Live: Circular Motion Dynamics, Banking of Roads & Conical Pendulum'
        : 'JEE Physics Live: Center of Mass Velocity & Momentum Conservation in Explosions',
      subject: is10th ? 'Science (Bio)' : is12th ? 'Biology' : 'Physics',
      date: '15 Oct 2026, 6:00 PM',
      duration: '1h 18m',
      instructor: 'Senior Kota Faculty',
      thumb: is10th ? THUMB_BOTANY : is12th ? THUMB_BOTANY : THUMB_PHYSICS
    },
    {
      title: is10th
        ? 'Class 10th Maths: Polynomials Geometrical Meaning of Zeroes & Relationship with Coefficients'
        : is12th
        ? '12th Physics Live: Electric Field due to an Infinite Line of Charge & Plane Sheet'
        : isNeet
        ? 'NEET Botany Live: Biomolecules, Enzyme Kinetics & Michaelis-Menten Equation'
        : 'JEE Maths Live: Sequences & Series, Telescoping Sums & Method of Differences',
      subject: is10th ? 'Mathematics' : is12th ? 'Physics' : isNeet ? 'Botany' : 'Mathematics',
      date: '14 Oct 2026, 5:00 PM',
      duration: '1h 25m',
      instructor: 'Kota Maths & Science HOD',
      thumb: is10th ? THUMB_MATHS : is12th ? THUMB_PHYSICS : isNeet ? THUMB_BOTANY : THUMB_MATHS
    },
    {
      title: is10th
        ? 'Class 10th Hindi: सूरदास के पद - व्याख्या, भावार्थ एवं महत्वपूर्ण बोर्ड प्रश्न'
        : is12th
        ? '12th Chemistry Live: Electrolysis, Faraday Laws & Kohlrausch Law Calculations'
        : isNeet
        ? 'NEET Zoology Live: Breathing & Mechanism of Respiration with Graphical Analysis'
        : 'JEE Physics Live: Rotational Inertia Calculations & Parallel/Perpendicular Axes Theorems',
      subject: is10th ? 'Hindi' : is12th ? 'Chemistry' : isNeet ? 'Zoology' : 'Physics',
      date: '13 Oct 2026, 4:00 PM',
      duration: '1h 10m',
      instructor: 'Shobhit Bhaiya & Kota Mentors',
      thumb: is10th ? THUMB_DEFAULT : is12th ? THUMB_CHEMISTRY : isNeet ? THUMB_ZOOLOGY : THUMB_PHYSICS
    },
    {
      title: is10th
        ? 'Class 10th Science: Light Reflection & Spherical Mirrors Ray Diagrams Masterclass'
        : is12th
        ? '12th Maths Live: Continuity at a Point & Intermediate Value Theorem Practice'
        : isNeet
        ? 'NEET Chemistry Live: Periodic Trends in Ionization Enthalpy & Electron Gain Enthalpy'
        : 'JEE Chemistry Live: Thermochemistry, Hess Law & Bond Enthalpy Advanced Numericals',
      subject: is10th ? 'Science (Physics)' : is12th ? 'Mathematics' : 'Chemistry',
      date: '12 Oct 2026, 6:30 PM',
      duration: '1h 28m',
      instructor: 'Senior Kota Faculty Team',
      thumb: is10th ? THUMB_PHYSICS : is12th ? THUMB_MATHS : THUMB_CHEMISTRY
    },
    {
      title: '🔴 Special Mentorship & Strategy: How to Revise Backlogs & Maximize Test Scores',
      subject: 'Strategy & Mentorship',
      date: '10 Oct 2026, 8:00 PM',
      duration: '1h 05m',
      instructor: 'Shobhit Bhaiya (GB Study Lead)',
      thumb: THUMB_DEFAULT
    }
  ];

  rawCompleted.forEach((item, idx) => {
    const compId = Math.abs(hashCode(`comp_${bId}_${idx + 1}`));
    const videoUrl = LECTURE_VIDEO_URLS[idx % LECTURE_VIDEO_URLS.length];
    const pdfUrl = LECTURE_PDF_URLS[idx % LECTURE_PDF_URLS.length];

    // Register media for this completed lecture
    registerMedia(courseId, compId, {
      title: item.title,
      description: `Recorded Live Class: ${item.title}. Taught on ${item.date} by ${item.instructor}. Duration: ${item.duration}.`,
      thumbnail: item.thumb,
      file_url: videoUrl,
      file_type: 2,
      video_type: 4,
      duration: 4800,
      download_urls: [
        { title: '720', url: videoUrl },
        { title: '480', url: videoUrl },
        { title: '360', url: videoUrl }
      ]
    });

    // Also register PDF notes for this completed lecture
    registerMedia(courseId, `pdf_${compId}`, {
      title: `${item.title} - Live Class Notes`,
      description: `Handwritten live blackboard notes for session conducted on ${item.date}.`,
      thumbnail: item.thumb,
      file_url: pdfUrl,
      file_type: 1
    });

    completedList.push({
      id: compId,
      video_id: compId,
      title: item.title,
      description: `Live recording from ${item.date} • Duration: ${item.duration} • Faculty: ${item.instructor}`,
      thumbnail: item.thumb,
      live_status: 2,
      is_live: 0,
      subject: item.subject,
      instructor: item.instructor,
      course: { title: `GB Study Batch ${courseId}` },
      file_url: videoUrl,
      pdf_url: pdfUrl,
      date_label: item.date
    });
  });

  return completedList;
}

// Simple deterministic hash code helper
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
