import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app_arrendador/main.dart';

void main() {
  testWidgets('App loads splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ArrendadorApp());
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
