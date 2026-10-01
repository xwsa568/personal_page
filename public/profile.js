// 이름, 소개, 링크, 프로젝트는 이 파일에서 수정하세요.
// 링크가 없으면 빈 문자열로 두세요. 외부 주소는 https://, 사이트 내 파일은 ./로 시작합니다.
window.PROFILE = {
  name: "Youngseo Kim",
  photo: "./profile.jpg",
  photoAlt: "Youngseo Kim at Korea University",
  intro: "I am a master’s student in the Department of Computer Science and Engineering at Korea University. I work in the",
  department: { name: "Department of Computer Science and Engineering", url: "https://cs.korea.ac.kr/cs/index.do#none" },
  university: { name: "Korea University", url: "https://www.korea.ac.kr/sites/ko/index.do" },
  lab: { name: "Multimodal Interactive Intelligence Laboratory (MIIL)", url: "https://miil.korea.ac.kr/" },
  advisor: { name: "Prof. Paul Hongsuck Seo", url: "https://phseo.github.io/" },
  research: "My research focuses on flow-based and one-step generative models for image and video generation, with an emphasis on generative model dynamics and stability.",
  // Newest first. Dates use YYYY-MM or YYYY-MM-DD.
  news: [
    // { date: "2026-09", text: "Your update here.", url: "" }
  ],
  about: "I am a master’s student in the Department of Computer Science and Engineering at Korea University, working in the Multimodal Interactive Intelligence Laboratory (MIIL) under the supervision of Prof. Paul Hongsuck Seo. My current research explores flow-based image editing and the training dynamics and stability of one-step generative models.",
  education: [
    { degree: "M.S. student in Computer Science and Engineering", period: "Sep. 2025 – Present", advisor: "Prof. Paul Hongsuck Seo" },
    { degree: "B.S. in Computer Science and Engineering", period: "Mar. 2019 – Aug. 2025", detail: "GPA: 3.86 / 4.5" }
  ],
  interests: ["Flow-based Generative Models", "One-step Generative Models", "Image and Video Generation", "Generative Model Dynamics and Stability"],
  cv: "./youngseo_kim_cv.pdf?v=e6104b6fd25c",
  email: "xwsa568@korea.ac.kr",
  github: "https://github.com/xwsa568",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/youngseo-kim-280317336/" },
    { label: "Google Scholar", url: "https://scholar.google.com/citations?user=7FV8w9wAAAAJ&hl=en" }
  ],
  isTemplate: false, // 실제 프로필로 수정한 뒤 false로 바꾸세요.
  publications: [
    {
      title: "Image Diffusion Models Exhibit Emergent Temporal Propagation in Videos",
      authors: "Youngseo Kim, Dohyun Kim, Geonhee Han, Paul Hongsuck Seo",
      venue: "arXiv preprint · arXiv:2511.19936",
      year: "2025",
      links: [{ label: "arXiv", url: "https://arxiv.org/abs/2511.19936" }, { label: "PDF", url: "https://arxiv.org/pdf/2511.19936" }]
    },
    {
      title: "SoccerNet 2024 Challenges Results",
      authors: "Anthony Cioppa, Silvio Giancola, Vladimir Somers, …, Youngseo Kim, …, Zhihao Li",
      venue: "arXiv preprint · arXiv:2409.10587",
      year: "2024",
      links: [{ label: "arXiv", url: "https://arxiv.org/abs/2409.10587" }, { label: "PDF", url: "https://arxiv.org/pdf/2409.10587" }]
    }
  ],
  researchExperience: [
    { period: "Sep. 2025 – Present", title: "Graduate Researcher", organization: "Multimodal Interactive Intelligence Laboratory (MIIL)", detail: "Korea University · Research on flow-based generative modeling, with a focus on image editing and one-step generation.", advisor: "Prof. Paul Hongsuck Seo", url: "https://miil.korea.ac.kr/" },
    { period: "Oct. 2024 – Aug. 2025", title: "Research Intern", organization: "Multimodal Interactive Intelligence Laboratory (MIIL)", detail: "Korea University, Korea", advisor: "Prof. Paul Hongsuck Seo", url: "https://miil.korea.ac.kr/" },
    { period: "Dec. 2023 – Sep. 2024", title: "Research Intern", organization: "Machine Learning and Vision Lab (MLV)", detail: "Korea University, Korea", advisor: "Prof. Hyunwoo J. Kim (now at KAIST)", url: "https://mlv.kaist.ac.kr/" }
  ],
  teachingExperience: [
    { period: "Fall 2026", title: "Teaching Assistant", organization: "Data Science and Artificial Intelligence (UNIV021)", detail: "Korea University" },
    { period: "Spring 2026", title: "Teaching Assistant", organization: "AI Expert Program — Algorithm Track", detail: "Samsung Electronics" },
    { period: "Fall 2025", title: "Teaching Assistant", organization: "Advanced Deep Learning (COSE475)", detail: "Korea University" }
  ],
  awards: [
    { period: "Jul. 2025", title: "2nd Place", organization: "2025 Spring Semester Individual Research and Capstone Design Fair", detail: "Korea University" },
    { period: "Jun. 2024", title: "2nd Place", organization: "SoccerNet 2024 Challenge — Multi-View Foul Recognition", detail: "CVPR 2024 CVsports workshop" },
    { period: "Oct. 2023", title: "1st Place", organization: "13th KSME Student Creative Design Competition", detail: "Minister of Science and ICT Award · The Korean Society of Mechanical Engineers" },
    { period: "Sep. 2020", title: "3rd Place", organization: "Capstone Design Fair 2020", detail: "Korea University" }
  ],
  projects: [
    {
      title: "Flow-based Image Editing",
      category: "ONGOING RESEARCH",
      summary: "State construction, guidance, and trajectory dynamics in flow-based image editing.",
      description: "Investigating state construction, guidance, and trajectory dynamics in flow-based image editing.",
      year: "2026",
      period: "2026 – Present"
    },
    {
      title: "One-step Generative Models",
      category: "ONGOING RESEARCH",
      summary: "Training dynamics and stability of models based on learned average velocity fields.",
      description: "Studying training dynamics and stability in one-step generative models based on learned average velocity fields.",
      year: "2026",
      period: "2026 – Present"
    },
    {
      title: "DRIFT — Temporal Propagation with Image Diffusion Models",
      category: "IMAGE DIFFUSION · VIDEO OBJECT SEGMENTATION",
      summary: "Diffusion self-attention for temporal label propagation in video object segmentation.",
      description: "Studied diffusion self-attention for temporal label propagation in video object segmentation.",
      year: "2025",
      period: "Feb. 2025 – Mar. 2026",
      links: [{ label: "arXiv", url: "https://arxiv.org/abs/2511.19936" }, { label: "PDF", url: "https://arxiv.org/pdf/2511.19936" }]
    },
    {
        "title": "VF-VARS: Leveraging Video Foundation Models for Video Assistant Referee Systems",
        "category": "2ND PLACE · SOCCERNET 2024",
        "summary": "Multi-View Foul Recognition · CVPR 2024 CVsports workshop",
        "description": "2nd Place, CVPRW 2024 SoccerNet Challenge — Multi-View Foul Recognition. VF-VARS leverages video foundation models for video assistant referee systems.",
        "year": "2024",
        "period": "Mar. 2024 – Jun. 2024",
        "links": [
            {
                "label": "GitHub",
                "url": "https://github.com/csjihwanh/SoccerNet-MLV"
            },
            {
                "label": "Technical Report",
                "url": "https://github.com/user-attachments/files/16122185/VF_VARS_v3.pdf"
            }
        ],
        "media": {
            "type": "image",
            "layout": "split",
            "caption": "VF-VARS architecture · VideoChat2 encoder, view aggregation, and classification head.",
            "showSourceLink": false,
            "url": "https://csjihwanh.com/assets/awards/vf-vars.png"
        }
    },
    {
        "title": "Development of an AI-Based Automatic Seat Belt Adjustment Device",
        "category": "1ST PLACE · KSME 2023",
        "summary": "The 13th KSME Student Creative Design Competition · Minister of Science and ICT Award",
        "description": "1st Place, The 13th KSME Student Creative Design Competition, organized by The Korean Society of Mechanical Engineers. Awarded the Minister of Science and ICT Award, Republic of Korea. The device automatically adjusts seat belt height using human pose estimation.",
        "year": "2023",
        "links": [
            {
                "label": "GitHub",
                "url": "https://github.com/csjihwanh/2023mech"
            },
            {
                "label": "Press",
                "url": "https://www.mtnews.net/news/articleView.html?idxno=17187"
            }
        ],
        "media": {
            "type": "image",
            "url": "https://csjihwanh.com/assets/awards/2023mech.gif",
            "layout": "split",
            "portrait": true,
            "caption": "Device demonstration · Source: Jihwan Hong / 2023mech project."
        }
    },
  ]
};
