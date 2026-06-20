import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../services/api_service.dart';
import '../services/session_service.dart';
import '../widgets/app_text_field.dart';
import 'home_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      _showError('Por favor, ingrese un email y contraseña');
      return;
    }

    setState(() => _loading = true);
    try {
      final data = await ApiService.login(email, password);
      final userId = data['id'] as int?;
      if (userId == null) {
        _showError('Credenciales incorrectas');
        return;
      }
      await SessionService.saveUserId(userId);
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } catch (_) {
      _showError('Credenciales incorrectas');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppColors.error),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Login',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.8,
                  child: Column(
                    children: [
                      AppTextField(
                        hint: 'Email',
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 10),
                      AppTextField(
                        hint: 'Password',
                        controller: _passwordController,
                        obscureText: true,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                PrimaryButton(
                  label: 'Continuar',
                  loading: _loading,
                  onPressed: _handleLogin,
                  widthFactor: 0.4,
                ),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const RegisterScreen()),
                    );
                  },
                  child: RichText(
                    text: const TextSpan(
                      style: TextStyle(fontSize: 16, color: AppColors.text),
                      children: [
                        TextSpan(text: 'No tienes una cuenta? '),
                        TextSpan(
                          text: 'Registrate',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
