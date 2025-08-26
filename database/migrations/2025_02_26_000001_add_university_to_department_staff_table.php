<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('department_staff', function (Blueprint $table) {
            // Add nullable university column after faculty for clarity; existing rows will be NULL
            $table->string('university')->nullable()->after('faculty');
        });
    }

    public function down(): void
    {
        Schema::table('department_staff', function (Blueprint $table) {
            if (Schema::hasColumn('department_staff', 'university')) {
                $table->dropColumn('university');
            }
        });
    }
};


