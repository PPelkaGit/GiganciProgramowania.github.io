import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { UserRole } from '../../data/mockData';
import Button from '../../components/Button';

interface Props {
  role: UserRole;
  onLogin: () => void;
  onBack: () => void;
}

const ROLE_CONFIG = {
  student: { color: Colors.student, emoji: '🧑‍💻', demoEmail: 'kacper@giganci.pl', demoPassword: '••••••••' },
  parent: { color: Colors.parent, emoji: '👨‍👩‍👧', demoEmail: 'anna@giganci.pl', demoPassword: '••••••••' },
  teacher: { color: Colors.teacher, emoji: '👨‍🏫', demoEmail: 'tomasz@giganci.pl', demoPassword: '••••••••' },
};

export default function LoginScreen({ role, onLogin, onBack }: Props) {
  const { t } = useTranslation();
  const config = ROLE_CONFIG[role];
  const [email, setEmail] = useState(config.demoEmail);
  const [password, setPassword] = useState(config.demoPassword);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <LinearGradient colors={[config.color + 'EE', config.color]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backText}>← {t('back')}</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.roleEmoji}>{config.emoji}</Text>
              <Text style={styles.roleName}>{t(`role_${role}` as any)}</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.title}>{t('login')}</Text>
              <Text style={styles.subtitle}>{t('login_subtitle')}</Text>

              <View style={styles.field}>
                <Text style={styles.label}>{t('email')}</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>{t('password')}</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.forgotLink}>
                <Text style={[styles.forgotText, { color: config.color }]}>{t('forgot_password')}</Text>
              </TouchableOpacity>

              <Button
                title={loading ? '' : t('login_button')}
                onPress={handleLogin}
                loading={loading}
                fullWidth
                size="lg"
                style={{ marginTop: Spacing.md }}
              />

              {/* Demo note */}
              <View style={styles.demoNote}>
                <Text style={styles.demoText}>💡 {t('demo_note')}</Text>
              </View>

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>{t('no_account')} </Text>
                <TouchableOpacity>
                  <Text style={[styles.registerLink, { color: config.color }]}>{t('register')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl },
  backBtn: { marginBottom: Spacing.lg },
  backText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  roleEmoji: { fontSize: 60, marginBottom: Spacing.sm },
  roleName: { ...Typography.h2, color: '#fff' },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.card,
  },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginBottom: Spacing.xl },
  field: { marginBottom: Spacing.md },
  label: { ...Typography.smallBold, color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bg,
  },
  inputIcon: { fontSize: 18, marginRight: Spacing.sm },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  forgotLink: { alignSelf: 'flex-end', marginBottom: Spacing.sm },
  forgotText: { fontSize: 13, fontWeight: '600' },
  demoNote: {
    backgroundColor: Colors.info + '18',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  demoText: { fontSize: 12, color: Colors.info, textAlign: 'center' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  registerText: { color: Colors.textSecondary, fontSize: 14 },
  registerLink: { fontSize: 14, fontWeight: '700' },
});
