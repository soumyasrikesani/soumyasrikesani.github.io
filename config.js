/* =============================================================================
   CONFIG — This is the ONLY file you normally need to edit.
   Everything below controls what shows on your portfolio.
   ============================================================================= */

const CONFIG = {
  /* --- Your GitHub username. All public repos are pulled from here. --- */
  githubUsername: "soumyasrikesani",

  /* --- Hero / About section --- */
  profile: {
    name: "Soumya Sri Kesani",
    title: "Data Scientist & Analytics",
    tagline:
      "I turn large, messy datasets into decisions — across clinical, environmental, and industrial domains.",
    about:
      "M.S. Data Science & Analytics candidate at the University of Oklahoma (GPA 3.90). " +
      "I work end-to-end: from raw ingestion and feature engineering to statistical modeling, " +
      "forecasting, and stakeholder-ready dashboards. Recent work includes 1.85M-record NASA " +
      "remote-sensing analysis, NLP complaint triage, and time-series energy forecasting.",
    location: "Norman, OK, USA",
    email: "soumyakesani@gmail.com",
    github: "https://github.com/soumyasrikesani",
    linkedin: "https://linkedin.com/in/soumya-sri-kesani-6a7355350",
    // Put a PDF in portfolio/assets/ and point to it, e.g. "assets/resume.pdf"
    resumeUrl: "assets/resume.pdf",
  },

  /* --- Skills shown as chips in the About section --- */
  skills: [
    "Python", "R", "SQL", "Scikit-learn", "Pandas", "SHAP",
    "Snowflake", "Tableau", "Power BI", "Streamlit",
    "Time-Series", "NLP", "Geospatial", "Google Earth Engine", "Azure",
  ],

  /* --- Categories (themes). A repo lands in the FIRST category it matches. ---
     Matching priority for each repo:
       1. An override below that sets `category`
       2. A GitHub topic on the repo that appears in `topics`
       3. A keyword found in the repo name/description/topics
     Anything unmatched goes to "Other Projects".
     Tip: add topics to your repos on GitHub for the cleanest sorting.        */
  categories: [
    {
      id: "nlp",
      name: "NLP & Text",
      description: "Language, classification, and text-driven pipelines.",
      topics: ["nlp", "text-classification", "text-mining"],
      keywords: ["nlp", "text", "churn", "complaint", "tf-idf", "tfidf", "sentiment", "language"],
    },
    {
      id: "forecasting",
      name: "Forecasting & Time-Series",
      description: "Temporal modeling and demand/consumption forecasting.",
      topics: ["forecasting", "time-series", "timeseries"],
      keywords: ["forecast", "time-series", "timeseries", "arima", "ets", "stl", "consumption", "demand"],
    },
    {
      id: "ml",
      name: "Machine Learning",
      description: "Predictive modeling, clustering, and anomaly detection.",
      topics: ["machine-learning", "ml", "classification", "clustering"],
      keywords: ["machine-learning", "classifier", "classification", "random-forest", "cluster",
                 "kmeans", "k-means", "anomaly", "isolation-forest", "prediction", "risk", "shap"],
    },
    {
      id: "viz",
      name: "Data Visualization",
      description: "Dashboards and interactive visual analytics.",
      topics: ["visualization", "dashboard", "tableau", "power-bi"],
      keywords: ["dashboard", "tableau", "power-bi", "powerbi", "visualization", "viz", "chart", "excel"],
    },
    {
      id: "geo",
      name: "Geospatial & Remote Sensing",
      description: "Spatial analysis, satellite data, and earth observation.",
      topics: ["geospatial", "gis", "remote-sensing"],
      keywords: ["geospatial", "gis", "spatial", "remote-sensing", "satellite", "viirs", "modis",
                 "earth-engine", "wildfire", "wild fire", "burned area", "forest", "ecoregion", "encroachment"],
    },
  ],

  /* --- Manual projects: shown alongside GitHub repos, NO repo required. ---
     Use this for work that isn't (or won't be) on GitHub — Tableau dashboards,
     coursework, private projects, etc. `category` must match a category id above
     (nlp, forecasting, ml, viz, geo) or omit it to land in "Other".
       - demo: optional live link (Tableau Public, Streamlit, etc.)
       - code: optional link (leave out to hide the "Code" button)
       - tech: array of tags shown as chips
       - featured: true to spotlight it at the top                              */
  manualProjects: [
    {
      title: "Stock Market Interactive Dashboard",
      category: "viz",
      language: "Tableau",
      description:
        "Cleaned and transformed multi-year stock market datasets (~2.5M records) and built interactive Tableau dashboards with time-series trend lines, volume overlays, and sector performance indicators with drill-down filtering.",
      tech: ["Tableau", "Excel", "Time-Series"],
      demo: "",   // paste a Tableau Public link here if you publish it
    },
    {
      title: "US Natural Gas Consumption Forecasting (1973–2025)",
      category: "forecasting",
      language: "Python",
      description:
        "End-to-end time-series pipeline on 627 months of EIA data: STL decomposition, ADF stationarity testing, and rolling-window model comparison across baseline, regression, ETS, and ARIMA specifications, evaluated with MAE, RMSE, and MAPE.",
      tech: ["Python", "ARIMA", "ETS", "STL", "Pandas"],
      demo: "",
    },
    {
      title: "Energy Consumption Forecasting: Steel Manufacturing",
      category: "forecasting",
      language: "Python",
      description:
        "Processed 35,040 industrial sensor records; built regression forecasting models, applied silhouette-scored K-Means clustering to identify 3 operational regimes, and used Isolation Forest anomaly detection to flag equipment fault conditions.",
      tech: ["Python", "Scikit-learn", "K-Means", "Isolation Forest"],
      demo: "",
    },
  ],

  /* --- Featured items: shown big at the top. Use exact repo names OR
         exact manual-project titles. --- */
  featured: [],

  /* --- Per-repo overrides. Key = exact repo name (case-sensitive). ---
     Any field you set here wins over the GitHub data. Example:
       "my-repo": {
         title: "Nicer Display Name",
         description: "A cleaner one-liner for recruiters.",
         demo: "https://your-streamlit-app.streamlit.app",
         category: "nlp",
         hidden: false
       }
  */
  overrides: {},

  /* --- Hide these repos entirely (exact names) --- */
  excludeRepos: ["soumyasrikesani", ".github"],

  /* --- Hide forks and archived repos --- */
  excludeForks: true,
  excludeArchived: true,
};
