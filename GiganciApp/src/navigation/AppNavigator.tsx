import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { Colors } from '../theme';
import { useTranslation } from 'react-i18next';

// Auth screens
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Student screens
import StudentDashboard from '../screens/student/StudentDashboard';
import ScheduleScreen from '../screens/student/ScheduleScreen';
import CoursesScreen from '../screens/student/CoursesScreen';
import MessagesScreen from '../screens/student/MessagesScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import AvatarReviewScreen from '../screens/student/AvatarReviewScreen';

// Parent screens
import ParentDashboard from '../screens/parent/ParentDashboard';
import PaymentsScreen from '../screens/parent/PaymentsScreen';

// Teacher screens
import TeacherDashboard from '../screens/teacher/TeacherDashboard';

const Stack = createNativeStackNavigator();
const StudentStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
    </View>
  );
}

function StudentApp() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      <StudentStack.Screen name="StudentTabs" component={StudentTabs} />
      <StudentStack.Screen name="AvatarReview" component={AvatarReviewScreen} />
    </StudentStack.Navigator>
  );
}

function StudentTabs() {
  const { t } = useTranslation();
  const { user } = useApp();
  const color = Colors.student;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.border,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={StudentDashboard}
        options={{ tabBarLabel: t('nav_home'), tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen}
        options={{ tabBarLabel: t('nav_schedule'), tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} /> }} />
      <Tab.Screen name="Courses" component={CoursesScreen}
        options={{ tabBarLabel: t('nav_courses'), tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} /> }} />
      <Tab.Screen name="Messages" component={MessagesScreen}
        options={{ tabBarLabel: t('nav_messages'), tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} />, tabBarBadge: 3 }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: t('nav_profile'), tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

function ParentTabs() {
  const { t } = useTranslation();
  const color = Colors.parent;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.border,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={ParentDashboard}
        options={{ tabBarLabel: t('nav_home'), tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Children" component={ParentDashboard}
        options={{ tabBarLabel: t('nav_children'), tabBarIcon: ({ focused }) => <TabIcon emoji="👨‍👩‍👧" focused={focused} /> }} />
      <Tab.Screen name="Messages" component={MessagesScreen}
        options={{ tabBarLabel: t('nav_messages'), tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} /> }} />
      <Tab.Screen name="Payments" component={PaymentsScreen}
        options={{ tabBarLabel: t('nav_payments'), tabBarIcon: ({ focused }) => <TabIcon emoji="💳" focused={focused} />, tabBarBadge: 2 }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: t('nav_profile'), tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

function TeacherTabs() {
  const { t } = useTranslation();
  const color = Colors.teacher;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.border,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={TeacherDashboard}
        options={{ tabBarLabel: t('nav_home'), tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen}
        options={{ tabBarLabel: t('nav_schedule'), tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} /> }} />
      <Tab.Screen name="Students" component={TeacherDashboard}
        options={{ tabBarLabel: t('nav_students'), tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} /> }} />
      <Tab.Screen name="Messages" component={MessagesScreen}
        options={{ tabBarLabel: t('nav_messages'), tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: t('nav_profile'), tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

function AuthFlow() {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = React.useState<'student' | 'parent' | 'teacher' | null>(null);

  if (!selectedRole) {
    return <RoleSelectScreen onSelectRole={setSelectedRole} />;
  }

  return (
    <LoginScreen
      role={selectedRole}
      onLogin={() => login(selectedRole)}
      onBack={() => setSelectedRole(null)}
    />
  );
}

export default function AppNavigator() {
  const { isLoggedIn, user } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthFlow} />
        ) : (
          <>
            {user?.role === 'student' && <Stack.Screen name="StudentApp" component={StudentApp} />}
            {user?.role === 'parent' && <Stack.Screen name="ParentApp" component={ParentTabs} />}
            {user?.role === 'teacher' && <Stack.Screen name="TeacherApp" component={TeacherTabs} />}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
