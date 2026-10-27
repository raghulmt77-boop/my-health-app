(() => {
  const $ = (id) => document.getElementById(id);
  const cfg = window.SUPABASE_CONFIG || {};
  const configured = cfg.url && cfg.anonKey &&
    !cfg.url.includes("YOUR_SUPABASE") && !cfg.anonKey.includes("YOUR_SUPABASE");
  let supabase = null;
  let mode = "login";

  const today = new Date();
  $("record-date").value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  function message(id, text, isError = false) {
    const el = $(id);
    el.textContent = text;
    el.classList.toggle("error", isError);
  }
  function showLoggedIn(user) {
    $("auth-panel").classList.add("hidden");
    $("app-panel").classList.remove("hidden");
    $("user-email").textContent = user.email || "Signed in";
    loadRecords();
  }
  function showLoggedOut() {
    $("auth-panel").classList.remove("hidden");
    $("app-panel").classList.add("hidden");
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[c]));
  }
  function setMode(nextMode) {
    mode = nextMode;
    $("tab-login").classList.toggle("active", mode === "login");
    $("tab-signup").classList.toggle("active", mode === "signup");
    $("auth-submit").textContent = mode === "login" ? "Sign in" : "Create account";
    $("password").autocomplete = mode === "login" ? "current-password" : "new-password";
    message("auth-message", "");
  }

  async function loadRecords() {
    if (!supabase) return;
    $("records-list").innerHTML = '<div class="empty-state">Loading saved entries…</div>';
    const { data, error } = await supabase.from("health_records")
      .select("id, entry_date, entry_type, title, content, created_at")
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      $("records-list").innerHTML = '<div class="empty-state error">Could not load entries. Check that schema.sql was run in Supabase.</div>';
      return;
    }
    if (!data || data.length === 0) {
      $("records-list").innerHTML = '<div class="empty-state">No saved entries yet. Your first entry will appear here.</div>';
      return;
    }
    $("records-list").innerHTML = data.map(record => `
      <article class="record-card">
        <div class="record-meta"><span class="record-type">${escapeHTML(record.entry_type)}</span><time>${escapeHTML(record.entry_date)}</time></div>
        <h4>${escapeHTML(record.title)}</h4>
        <p>${escapeHTML(record.content).replace(/\n/g, "<br>")}</p>
        <button class="delete-link" type="button" data-delete="${escapeHTML(record.id)}">Delete entry</button>
      </article>`).join("");
    $("records-list").querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", () => deleteRecord(btn.dataset.delete));
    });
  }

  async function deleteRecord(id) {
    if (!confirm("Delete this saved entry? This cannot be undone.")) return;
    const { error } = await supabase.from("health_records").delete().eq("id", id);
    if (error) {
      alert("Could not delete this entry. Please try again.");
      return;
    }
    loadRecords();
  }

  if (!configured || !window.supabase) {
    $("setup-warning").classList.remove("hidden");
    message("auth-message", "Connect your Supabase project to enable sign-in and database storage.", true);
    $("auth-form").addEventListener("submit", e => {
      e.preventDefault();
      message("auth-message", "Setup required: add your Supabase URL and public anon key to config.js, then run schema.sql.", true);
    });
    $("tab-login").addEventListener("click", () => setMode("login"));
    $("tab-signup").addEventListener("click", () => setMode("signup"));
    return;
  }

  supabase = window.supabase.createClient(cfg.url, cfg.anonKey);

  $("tab-login").addEventListener("click", () => setMode("login"));
  $("tab-signup").addEventListener("click", () => setMode("signup"));

  $("auth-form").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("email").value.trim();
    const password = $("password").value;
    $("auth-submit").disabled = true;
    message("auth-message", mode === "login" ? "Signing in…" : "Creating account…");
    try {
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      if (mode === "signup" && !result.data.session) {
        message("auth-message", "Account created. Check your email to confirm your account, then sign in.");
      } else if (result.data.user) {
        message("auth-message", "Signed in successfully.");
        showLoggedIn(result.data.user);
      }
    } catch (err) {
      message("auth-message", err.message || "Authentication failed.", true);
    } finally {
      $("auth-submit").disabled = false;
    }
  });

  $("record-form").addEventListener("submit", async e => {
    e.preventDefault();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      message("record-message", "Please sign in again.", true);
      return;
    }
    const entry = {
      user_id: authData.user.id,
      entry_date: $("record-date").value,
      entry_type: $("record-type").value,
      title: $("record-title").value.trim(),
      content: $("record-content").value.trim()
    };
    const { error } = await supabase.from("health_records").insert(entry);
    if (error) {
      message("record-message", error.message, true);
      return;
    }
    $("record-form").reset();
    $("record-date").value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    message("record-message", "Saved to your database.");
    loadRecords();
  });

  $("refresh-records").addEventListener("click", loadRecords);
  $("signout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    showLoggedOut();
  });

  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) showLoggedIn(data.session.user);
    else showLoggedOut();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) showLoggedIn(session.user);
    else showLoggedOut();
  });
})();
