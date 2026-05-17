body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: white;
}

nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #111827;
}

a {
  color: #60a5fa;
  text-decoration: none;
  margin-left: 1rem;
}

h1, h2, h3 {
  margin: 0.5rem 0;
}

.container {
  padding: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.card {
  background: #1f2937;
  padding: 1rem;
  border-radius: 10px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  border: none;
}

button {
  padding: 10px 14px;
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
