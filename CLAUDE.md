# Règles pour Claude - Projet Hautbois

## 🎯 Règles de Base

### Documentation
- ❌ **NE PAS** générer de documentation automatiquement
- ❌ **NE PAS** créer de fichiers README, GUIDE, CHANGELOG, etc. sans demande explicite
- ✅ **UNIQUEMENT** créer de la documentation si demandé explicitement
- ✅ Se concentrer sur le code fonctionnel en priorité

### Code
- ✅ Écrire du code propre et fonctionnel
- ✅ Commenter uniquement les parties complexes
- ✅ Privilégier la clarté du code à la documentation extensive
- ✅ Tester que le code compile avant de livrer

### Communication
- ✅ Répondre de manière concise
- ✅ Poser des questions de clarification si nécessaire
- ❌ Éviter les longues explications non demandées
- ✅ Aller droit au but

## 🔧 Workflow Standard

1. **Comprendre** la demande
2. **Coder** la solution
3. **Tester** la compilation
4. **Livrer** avec un résumé court

## 📝 Format de Réponse

### Pour une nouvelle fonctionnalité
```
✅ Fonctionnalité implémentée : [Nom]
📁 Fichiers modifiés : [Liste]
🧪 Tests : [Statut]
💡 Notes : [Si nécessaire, 1-2 lignes max]
```

### Pour une correction
```
🐛 Problème : [Description courte]
✅ Solution : [Ce qui a été fait]
```

## 🚫 À Éviter

- Créer 8 fichiers de documentation pour une feature
- Écrire des guides de 300 lignes
- Générer des changelogs non demandés
- Créer des exemples visuels ASCII art
- Faire des résumés de résumés

## ✅ À Faire

- Code fonctionnel et testé
- Réponses courtes et précises
- Documentation inline dans le code (commentaires)
- Demander confirmation avant de générer de la doc

---

**En résumé** : Code d'abord, documentation seulement si demandée explicitement.