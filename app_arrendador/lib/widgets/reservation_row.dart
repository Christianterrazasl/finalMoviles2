import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../models/reservation.dart';

String formatDate(String dateStr) {
  try {
    final parts = dateStr.split('-');
    if (parts.length == 3) {
      return '${parts[2]}/${parts[1]}/${parts[0]}';
    }
  } catch (_) {}
  return dateStr;
}

class ReservationRow extends StatelessWidget {
  final Reservation reservation;

  const ReservationRow({super.key, required this.reservation});

  @override
  Widget build(BuildContext context) {
    final url = reservation.placePhotoUrl;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: url != null
                ? Image.network(
                    url,
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => _placeholder(),
                  )
                : _placeholder(),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  reservation.cliente?.nombrecompleto ?? 'Cliente',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 6),
                _detail('Noches', '${reservation.noches}'),
                _detail('Llegada', formatDate(reservation.fechaInicio)),
                _detail('Salida', formatDate(reservation.fechaFin)),
                const SizedBox(height: 4),
                Text(
                  'Total: \$${reservation.precioTotal.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _placeholder() {
    return Container(
      width: 80,
      height: 80,
      color: AppColors.border,
      child: const Icon(Icons.image, color: AppColors.textMuted),
    );
  }

  Widget _detail(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
          Text(
            value,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.text),
          ),
        ],
      ),
    );
  }
}
