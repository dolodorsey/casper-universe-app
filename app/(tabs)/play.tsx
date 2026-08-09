import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { loadTrivia, type TriviaQuestion } from '@/lib/catalog';

export default function PlayScreen() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [title, setTitle] = useState('Universe Knowledge');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrivia()
      .then(({ packs, questions: rows }) => {
        const launchPack = packs.find((pack) => pack.title === 'Know the CASPER Universe') ?? packs[0];
        setTitle(launchPack?.title ?? 'Universe Knowledge');
        setQuestions(rows.filter((question) => !launchPack || question.pack_id === launchPack.id));
      })
      .catch(() => setError('CASPER trivia is temporarily unavailable.'))
      .finally(() => setLoading(false));
  }, []);

  const question = questions[index];
  const complete = questions.length > 0 && index >= questions.length;
  const progress = useMemo(() => `${Math.min(index + 1, questions.length)} / ${questions.length}`, [index, questions.length]);

  const choose = (choiceIndex: number) => {
    if (selected !== null || !question) return;
    setSelected(choiceIndex);
    if (choiceIndex === question.answer_index) setScore((value) => value + 1);
  };

  const next = () => {
    setSelected(null);
    setIndex((value) => value + 1);
  };

  const restart = () => {
    setSelected(null);
    setScore(0);
    setIndex(0);
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>PLAY · LEARN · EXPLORE</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.copy}>Test how well you know the independent brands inside the CASPER Universe.</Text>

        {loading && <ActivityIndicator color="#D4B87A" style={styles.state} />}
        {error && <Text style={styles.state}>{error}</Text>}
        {!loading && !error && questions.length === 0 && <Text style={styles.state}>No live trivia pack is published yet.</Text>}

        {question && !complete && (
          <View style={styles.card}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>QUESTION {progress}</Text>
              <Text style={styles.meta}>SCORE {score}</Text>
            </View>
            <Text style={styles.question}>{question.question}</Text>
            <View style={styles.choices}>
              {question.choices.map((choice, choiceIndex) => {
                const answered = selected !== null;
                const correct = answered && choiceIndex === question.answer_index;
                const wrong = answered && choiceIndex === selected && !correct;
                return (
                  <Pressable
                    key={`${question.id}-${choiceIndex}`}
                    onPress={() => choose(choiceIndex)}
                    style={[styles.choice, correct && styles.correct, wrong && styles.wrong]}
                  >
                    <Text style={styles.choiceText}>{choice}</Text>
                  </Pressable>
                );
              })}
            </View>
            {selected !== null && (
              <View style={styles.answer}>
                <Text style={styles.answerTitle}>{selected === question.answer_index ? 'CORRECT' : 'NOT QUITE'}</Text>
                <Text style={styles.answerCopy}>{question.explanation}</Text>
                <Pressable onPress={next} style={styles.next}><Text style={styles.nextText}>NEXT QUESTION →</Text></Pressable>
              </View>
            )}
          </View>
        )}

        {complete && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>PACK COMPLETE</Text>
            <Text style={styles.result}>{score} / {questions.length}</Text>
            <Text style={styles.copy}>Knowledge mode does not issue points. Reward points remain tied to verified CASPER activations.</Text>
            <Pressable onPress={restart} style={styles.next}><Text style={styles.nextText}>PLAY AGAIN</Text></Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0D0D14' },
  content: { padding: 24, paddingBottom: 120 },
  eyebrow: { color: '#D4B87A', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#F5F0E8', fontSize: 34, fontWeight: '800', marginTop: 12 },
  copy: { color: '#8D8994', fontSize: 14, lineHeight: 22, marginTop: 10 },
  state: { color: '#8D8994', marginTop: 48, textAlign: 'center' },
  card: { marginTop: 30, padding: 22, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.045)', borderWidth: 1, borderColor: 'rgba(255,255,255,.1)' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { color: '#77727D', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  question: { color: '#F5F0E8', fontSize: 24, lineHeight: 32, fontWeight: '700', marginTop: 26 },
  choices: { gap: 10, marginTop: 24 },
  choice: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(245,240,232,.14)', backgroundColor: 'rgba(245,240,232,.035)' },
  correct: { borderColor: '#58B77A', backgroundColor: 'rgba(88,183,122,.15)' },
  wrong: { borderColor: '#E25C5C', backgroundColor: 'rgba(226,92,92,.14)' },
  choiceText: { color: '#F5F0E8', fontSize: 14, fontWeight: '600' },
  answer: { marginTop: 22, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(245,240,232,.1)' },
  answerTitle: { color: '#D4B87A', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  answerCopy: { color: '#A7A2AD', fontSize: 13, lineHeight: 20, marginTop: 8 },
  next: { padding: 15, borderRadius: 12, backgroundColor: '#D4B87A', alignItems: 'center', marginTop: 18 },
  nextText: { color: '#09080C', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  result: { color: '#F5F0E8', fontSize: 54, fontWeight: '900', marginTop: 16 },
});
