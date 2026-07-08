/* =============================================================================
   CONFIG — the only file you normally edit.
   Profile, skills, projects (with Intro / Data & Tools / Methodology / Insights),
   certifications, and work-authorization note all live here.
   ============================================================================= */

const CONFIG = {
  githubUsername: "soumyasrikesani",

  /* ------------------------------------------------------------------ PROFILE */
  profile: {
    name: "Soumya Sri Kesani",
    subheading: "M.S. Data Science & Analytics · University of Oklahoma",
    tagline:
      "I turn messy datasets into decisions, valuable insights, and measurable impact " +
      "across clinical, environmental, industrial, and financial domains.",

    // Drop your photo in portfolio/assets/ and set the file name here.
    // (If the file is missing, the site just hides the image — nothing breaks.)
    avatar: "assets/Avatar.png",

    location: "Ready to relocate",
    email: "soumyakesani@gmail.com",
    github: "https://github.com/soumyasrikesani",
    linkedin: "https://linkedin.com/in/soumya-sri-kesani-6a7355350",
    resumeUrl: "assets/resume.pdf",

    bio:
      "I'm a Data Science & Analytics graduate student at the University of Oklahoma (GPA 3.90) " +
      "with published research and hands-on experience taking large, messy datasets from raw " +
      "ingestion all the way to statistical models, forecasts, and stakeholder-ready dashboards. " +
      "My work spans NLP, time-series forecasting, machine learning, geospatial remote sensing, " +
      "and data engineering, including sponsored research analyzing 1.85M NASA VIIRS satellite " +
      "detections across 53 African countries. I care about reproducible workflows, explainable " +
      "models, and translating complex findings into decisions non-technical audiences can act on.",

    // Quick "impress the recruiter" stats shown as a strip in the About section.
    highlights: [
      { value: "3.90/4.0", label: "Graduate GPA" },
      { value: "1.85M", label: "NASA records analyzed" },
      { value: "Published", label: "Peer-reviewed (IJCERT)" },
      { value: "11+", label: "End-to-end projects" },
    ],
  },

  /* ------------------------------------------------------------------- SKILLS
     Logos load from simpleicons.org by `slug`. If a slug is missing or fails,
     the chip gracefully shows just the label. Find slugs at simpleicons.org.   */
  skillGroups: [
    {
      name: "Languages",
      items: [
        { label: "Python", slug: "python" },
        { label: "R", slug: "r" },
        { label: "SQL", slug: "" },
        { label: "Java", slug: "openjdk" },
        { label: "JavaScript", slug: "javascript" },
        { label: "AMPL", slug: "" },
      ],
    },
    {
      name: "ML & Data Science",
      items: [
        { label: "scikit-learn", slug: "scikitlearn" },
        { label: "Pandas", slug: "pandas" },
        { label: "NumPy", slug: "numpy" },
        { label: "SHAP", slug: "" },
        { label: "ARIMA / ETS", slug: "" },
      ],
    },
    {
      name: "Data & Cloud",
      items: [
        { label: "Snowflake", slug: "snowflake" },
        { label: "Microsoft Azure", slug: "microsoftazure" },
        { label: "MySQL", slug: "mysql" },
        { label: "SQLite", slug: "sqlite" },
        { label: "Google Earth Engine", slug: "googleearthengine" },
      ],
    },
    {
      name: "Visualization & BI",
      items: [
        { label: "Excel", slug: "microsoftexcel" },
        { label: "Tableau", slug: "tableau" },
        { label: "Power BI", slug: "powerbi" },
        { label: "Streamlit", slug: "streamlit" },
        { label: "Matplotlib", slug: "" },
        { label: "ggplot2", slug: "" },
      ],
    },
    {
      name: "Tools & Workflow",
      items: [
        { label: "Git", slug: "git" },
        { label: "GitHub", slug: "github" },
        { label: "Django", slug: "django" },
        { label: "Claude Code", slug: "anthropic" },
      ],
    },
  ],

  /* --------------------------------------------------------------- CATEGORIES */
  categories: [
    { id: "nlp", name: "NLP & Text" },
    { id: "ml", name: "Machine Learning" },
    { id: "forecasting", name: "Forecasting & Time-Series" },
    { id: "geo", name: "Geospatial & Remote Sensing" },
    { id: "viz", name: "Data Visualization & BI" },
    { id: "dataeng", name: "Data Engineering" },
    { id: "web", name: "Web & Applications" },
  ],

  /* ----------------------------------------------------------------- PROJECTS
     Each project renders as a full-width panel with slide tabs:
       intro  → Introduction
       data   → Data & Tools
       method → Methodology
       insights → Insights
     `repo` links the GitHub code button AND prevents the auto-sync from
     duplicating that repo. `demo` adds a Live-demo button. `featured: true`
     spotlights it at the top.                                                  */
  projects: [
    {
      title: "Wildfire Encroachment into African Moist Forests",
      category: "geo",
      featured: true,
      repo: "africa wildfire viirs",
      tools: ["R", "Google Earth Engine", "sf / terra / igraph", "QGIS", "Mann-Kendall"],
      tags: ["Sponsored Research · DISC"],
      sections: {
        intro:
          "Sponsored research at the Data Institute for Societal Challenges (DISC, PI Dr. Michael Wimberly) " +
          "quantifying how wildfires are encroaching into Africa's moist tropical forests, ecosystems where " +
          "low-severity surface fires advance beneath closed canopy and are routinely missed by global burned-area products.",
        data:
          "1.85M NASA VIIRS SNPP thermal detections (2013–2024) across 53 African countries, validated against " +
          "independent Landsat dNBR reference data via Google Earth Engine. Built in R (sf, terra, igraph, gstat) with QGIS.",
        method:
          "Coordinate reprojection, spatial clipping, deduplication, and rigorous missing-value validation to build a " +
          "reproducible dataset; graph-theoretic spatiotemporal clustering (igraph + Delaunay triangulation) reconstructed " +
          "780,000+ discrete fire events; IDW spatial interpolation; Mann-Kendall non-parametric trend testing across 12 protected reserves.",
        insights:
          "14.1% improvement in burned-area detection over the MODIS MCD64A1 global standard; mean Kappa 0.588 across six " +
          "validation sites; identified Tinte Bepo and Opro River as statistically significant encroachment frontiers. Delivered a " +
          "formal accuracy-assessment report and version-controlled codebase to the project sponsor.",
      },
    },
    {
      title: "NLP Consumer Complaint & Churn-Risk Pipeline",
      category: "nlp",
      featured: true,
      repo: "customer churn nlp",
      tools: ["Python", "Snowflake", "TF-IDF", "scikit-learn", "Streamlit"],
      tags: [],
      sections: {
        intro:
          "An end-to-end NLP system that triages consumer financial complaints and flags churn risk directly from " +
          "unstructured narrative text, turning free-form grievances into routable, prioritized signals.",
        data:
          "767,000+ CFPB consumer-complaint narratives combining structured metadata and free text. " +
          "Python, Snowflake + SQL, scikit-learn, and Streamlit.",
        method:
          "Raw CSV ingestion into Snowflake → SQL-based transformation → TF-IDF vectorization of narratives; trained " +
          "Logistic Regression, Naive Bayes, and Random Forest on combined structured + text features; evaluated with " +
          "F1, precision, and recall across class-balanced splits.",
        insights:
          "Deployed a live Streamlit triage dashboard for real-time complaint routing and churn-risk visualization; " +
          "the interpretable models surface which complaint themes are most associated with churn.",
      },
    },
    {
      title: "Heart Disease Risk Stratification (EarlyMed)",
      category: "ml",
      featured: true,
      repo: "heart disease risk stratification",
      tools: ["Python", "scikit-learn", "SHAP", "Pandas", "Excel"],
      tags: ["Explainable AI"],
      sections: {
        intro:
          "An explainable clinical model that stratifies heart-disease risk and, crucially, communicates the drivers of " +
          "that risk to non-technical clinical stakeholders.",
        data:
          "70,000-row, 19-feature clinical dataset spanning biometrics, lifestyle indicators, and comorbidity variables. " +
          "Python, Pandas, scikit-learn, SHAP, Excel.",
        method:
          "Multivariate EDA and outlier analysis; feature engineering including WHO BMI risk bands and stress-sleep " +
          "interaction terms; trained Random Forest and Logistic Regression; SHAP explainability to quantify per-feature contributions.",
        insights:
          "AUC 0.91 and F1 0.88; blood pressure, cholesterol, and family history identified as the dominant predictors; " +
          "delivered an interactive Excel pivot dashboard for risk stratification by age band, gender, and lifestyle cluster.",
      },
    },
    {
      title: "US Natural Gas Consumption Forecasting (1973–2025)",
      category: "forecasting",
      tools: ["Python", "ARIMA", "ETS", "STL", "Pandas"],
      tags: [],
      sections: {
        intro:
          "A long-horizon time-series study forecasting US natural-gas consumption and rigorously comparing classical forecasting families.",
        data: "627 months of EIA consumption data (1973–2025). Python, Pandas, statsmodels.",
        method:
          "STL decomposition to separate trend, seasonal, and residual components; ADF stationarity testing before model " +
          "selection; rolling-window model comparison across baseline, regression, ETS, and ARIMA; evaluated with MAE, RMSE, and MAPE.",
        insights:
          "ARIMA selected as the optimal specification, capturing both trend and seasonal dynamics; delivered a reproducible " +
          "rolling-validation framework for principled model selection.",
      },
    },
    {
      title: "Energy Forecasting: Steel Manufacturing",
      category: "forecasting",
      tools: ["Python", "scikit-learn", "K-Means", "Isolation Forest"],
      tags: [],
      sections: {
        intro:
          "Industrial energy analytics on steel-manufacturing sensor data, forecasting consumption while detecting " +
          "distinct operating regimes and equipment faults.",
        data: "35,040 industrial sensor records. Python, scikit-learn.",
        method:
          "Regression forecasting models; silhouette-scored K-Means clustering to characterize operational regimes; " +
          "Isolation Forest anomaly detection on the sensor stream.",
        insights:
          "Identified 3 distinct operational regimes and flagged equipment fault conditions, a foundation for " +
          "predictive-maintenance triage.",
      },
    },
    {
      title: "Stock Market Interactive Dashboard",
      category: "viz",
      tools: ["Tableau", "Excel"],
      tags: [],
      sections: {
        intro: "An interactive equities dashboard for exploring multi-year market trends with multi-dimensional drill-down.",
        data: "~2.5M records of multi-year stock-market data. Tableau, Excel.",
        method:
          "Cleaned and transformed the raw datasets; built time-series trend lines, volume overlays, and sector-performance " +
          "indicators with drill-down filtering.",
        insights: "Enables fast visual exploration of sector rotation and volume-price dynamics for non-technical audiences.",
      },
    },
    {
      title: "Retail Operations KPI Dashboard",
      category: "viz",
      tools: ["SQL", "Python", "Power BI", "DAX", "Pandas"],
      tags: ["Business Intelligence"],
      sections: {
        intro:
          "A business-intelligence dashboard monitoring retail transactions in near real time and surfacing revenue-concentration risk.",
        data: "150,000 retail transactions. SQL, Python/Pandas, Power BI (DAX).",
        method:
          "SQL aggregation and Pandas preparation feeding DAX KPI measures; automated anomaly flagging over the transaction stream.",
        insights: "Identified a 22% revenue-concentration risk and automated anomaly flags for ongoing operational monitoring.",
      },
    },
    {
      title: "Automated Bank Statement ETL System",
      category: "dataeng",
      tools: ["Python", "pdfplumber", "Pandas", "Isolation Forest"],
      tags: [],
      sections: {
        intro:
          "A multi-format ETL system that turns messy PDF bank statements into clean, analysis-ready financial data " +
          "for a downstream finance dashboard.",
        data: "Multi-format PDF bank statements. Python, pdfplumber, Pandas, scikit-learn.",
        method:
          "pdfplumber-based extraction that normalizes and validates transactions into a schema-consistent CSV; " +
          "ML-based transaction categorization, spending forecasting, and Isolation Forest anomaly detection.",
        insights:
          "Provides a reliable data layer for financial dashboards with automated categorization and anomaly detection on real transactions.",
      },
    },
    {
      title: "National Parks Service Database System",
      category: "dataeng",
      tools: ["SQL", "MySQL", "Microsoft Azure"],
      tags: ["Cloud"],
      sections: {
        intro: "A relational database system for US National Parks operations, designed from first principles and deployed to the cloud.",
        data: "Parks, visitor, ranger, and facility-management workflows. SQL, MySQL, Microsoft Azure.",
        method:
          "ER modeling and a 3NF-normalized schema; primary/foreign-key constraints, indexed columns, and stored procedures; " +
          "deployed to Microsoft Azure with role-based access controls.",
        insights: "Validated end-to-end query performance across operational workflows in a production-style cloud deployment.",
      },
    },
    {
      title: "Chronic Disease Prediction from Wearables",
      category: "ml",
      tools: ["Python", "scikit-learn", "NumPy", "Pandas"],
      tags: ["Healthcare"],
      sections: {
        intro: "A classification pipeline predicting chronic-disease risk from wearable biometric signals.",
        data: "Physiological / biometric signals from wearable devices. Python, NumPy, Pandas, scikit-learn.",
        method:
          "Feature engineering from physiological data; trained and compared Random Forest, SVM, and Logistic Regression classifiers.",
        insights: "Feeds a real-time alert pipeline for early risk flagging from continuous biometric streams.",
      },
    },
    {
      title: "E-Commerce Price Comparison Tool",
      category: "web",
      tools: ["Python", "Django", "SQLite", "BeautifulSoup"],
      tags: [],
      sections: {
        intro: "A web application that tracks and compares product prices across multiple e-commerce sites over time.",
        data: "Live product listings scraped across multiple retailers. Python, Django, SQLite, BeautifulSoup.",
        method:
          "Automated scraping pipelines with historical price storage in SQLite; a Django web app for side-by-side comparison and tracking.",
        insights: "Historical price tracking helps identify the best time and site to buy.",
      },
    },
  ],

  /* ----------------------------------------------------------- CERTIFICATIONS
     Add your real certifications here (shown newest first). The publication is
     pre-filled as a credential; replace/extend with your Coursera/Google/Azure/
     etc. certificates.                                                          */
  certifications: [
    {
      title: "Data Analytics Job Simulation",
      issuer: "Deloitte Australia · Forage",
      year: "",
      link: "",
      note: "Simulated real-world data-analytics tasks including data cleaning, dashboard creation, and deriving business insights.",
    },
    {
      title: "Claude Code 101",
      issuer: "Anthropic · Skilljar",
      year: "",
      link: "",
      note: "Agentic coding workflows, CLI-based code generation, and responsible LLM tool use in professional development environments.",
    },
    {
      title: "Prompt Engineering with ChatGPT",
      issuer: "LinkedIn Learning",
      year: "",
      link: "",
      note: "Structured prompting including chain-of-thought, role assignment, and iterative refinement for data-analysis workflows.",
    },
    {
      title: "Hands-On SQL",
      issuer: "LinkedIn Learning",
      year: "",
      link: "",
      note: "Practical SQL covering joins, subqueries, window functions, and query optimization on real-world relational datasets.",
    },
    {
      title: "Geographic Alert Systems: Research & Implementation",
      issuer: "IJCERT · Peer-Reviewed Journal Publication",
      year: "2023",
      link: "",
      note: "Co-authored research on geospatial alert-system design and implementation.",
    },
  ],

  /* ---------------------------------------------------- WORK AUTHORIZATION NOTE */
  workAuthorization:
    "I'm currently on F-1 OPT and legally authorized to work in the U.S. for up to 3 years " +
    "without employer sponsorship. Reach out to learn more about my work and availability.",

  /* -------------------------------------------------------- AUTO-SYNC SETTINGS
     New public repos you push (that aren't already a curated project above)
     appear automatically under their theme. */
  excludeRepos: [
    "soumyasrikesani",
    "soumyasrikesani.github.io",
    ".github",
    "Wild fire encroachment in African moist forest ", // same project as the curated geo entry
  ],
  excludeForks: true,
  excludeArchived: true,
};
