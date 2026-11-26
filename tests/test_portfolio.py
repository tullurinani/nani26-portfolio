from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PortfolioSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.home = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.app = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
        cls.learning_index = (ROOT / "docs/learning/README.md").read_text(encoding="utf-8")

    def test_homepage_has_professional_metadata(self):
        self.assertIn('<title>Nani Tulluri | IAM, Saviynt & Java Portfolio</title>', self.home)
        self.assertIn('name="description"', self.home)
        self.assertIn('rel="canonical"', self.home)

    def test_primary_sections_are_present(self):
        for section in ("about", "experience", "skills", "projects", "notes", "contact"):
            self.assertIn(f'id="{section}"', self.home)

    def test_learning_search_is_wired(self):
        self.assertIn('id="notesSearch"', self.home)
        self.assertIn('$("#notesSearch")?.addEventListener("input", renderLearningNotes);', self.app)
        self.assertIn("visibleNotes = learningNotes.filter", self.app)

    def test_learning_library_contains_core_topics(self):
        for topic in ("Saviynt", "SailPoint", "Java", "JDBC", "Segregation of Duties"):
            self.assertIn(topic, self.learning_index)

    def test_contact_and_profile_links_are_present(self):
        for value in ("tullurinani26@gmail.com", "https://www.linkedin.com/in/nanitulluri/", "https://github.com/tullurinani"):
            self.assertIn(value, self.home)

    def test_learning_notes_are_not_empty(self):
        self.assertGreaterEqual(self.app.count('category: "'), 10)


if __name__ == "__main__":
    unittest.main()
