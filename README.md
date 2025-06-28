# Travel Archetype Quiz

A beautiful, interactive web-based quiz that helps users discover their unique travel personality through 12 carefully crafted questions.

## Features

- 🌍 **12 Travel Archetypes**: From Pathfinder to Spiritual Nomad, discover your travel style
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📊 **Progress Tracking**: Visual progress bar and question counter
- 🔄 **Navigation**: Go back and forth between questions
- 📤 **Share Results**: Share your archetype with friends
- 🎯 **Tie Handling**: Supports multiple archetypes if there's a tie

## How to Host on GitHub Pages

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Your quiz will be available at**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── quiz.json           # Quiz questions and options
└── README.md           # This file
```

## Quiz Archetypes

- **Pathfinder**: Adventure seeker who finds hidden gems
- **Connector**: Social butterfly who builds relationships
- **Time Traveler**: History and culture enthusiast
- **Hedonist**: Pleasure and comfort seeker
- **Digital Drifter**: Remote worker and modern nomad
- **Culture Hacker**: Deep cultural immersion seeker
- **Escape Artist**: Solitude and peace seeker
- **Luxe Nomad**: Style and comfort traveler
- **Local Whisperer**: Authentic local experience finder
- **Chaos Pilot**: Spontaneous adventure lover
- **Spiritual Nomad**: Inner growth and meaning seeker
- **Builder**: Impact and contribution focused

## Customization

### Adding New Questions
Edit `quiz.json` to add new questions following the existing format:
```json
{
  "id": 13,
  "question": "Your new question here?",
  "options": [
    { "text": "Option 1", "archetype": "ArchetypeName" },
    { "text": "Option 2", "archetype": "ArchetypeName" }
  ]
}
```

### Changing Colors
Edit the CSS variables in `styles.css` to customize the color scheme.

### Adding New Archetypes
1. Add the archetype name to the `archetypes` array in `quiz.json`
2. Add the description to the `archetypeDescriptions` object in `script.js`
3. Create questions that reference the new archetype

## Local Development

To test locally, simply open `index.html` in a web browser. For the best experience, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues and enhancement requests! 