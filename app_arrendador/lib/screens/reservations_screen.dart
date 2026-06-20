import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../models/reservation.dart';
import '../services/api_service.dart';
import '../widgets/reservation_row.dart';

class ReservationsScreen extends StatefulWidget {
  final int lugarId;
  final String placeName;

  const ReservationsScreen({
    super.key,
    required this.lugarId,
    required this.placeName,
  });

  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  List<Reservation> _reservations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadReservations();
  }

  Future<void> _loadReservations() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getReservationsByPlace(widget.lugarId);
      if (mounted) setState(() => _reservations = data);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.text),
        title: Text(
          'Reservas',
          style: const TextStyle(color: AppColors.text, fontWeight: FontWeight.bold),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.placeName,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.text,
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (_reservations.isEmpty)
                    const Expanded(
                      child: Center(
                        child: Text(
                          'No hay reservas para este lugar',
                          style: TextStyle(fontSize: 16, color: AppColors.textMuted),
                        ),
                      ),
                    )
                  else
                    Expanded(
                      child: ListView.builder(
                        itemCount: _reservations.length,
                        itemBuilder: (context, index) {
                          return ReservationRow(reservation: _reservations[index]);
                        },
                      ),
                    ),
                ],
              ),
            ),
    );
  }
}
